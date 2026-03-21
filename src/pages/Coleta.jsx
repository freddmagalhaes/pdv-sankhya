import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageOpen, ScanLine, LogOut, CheckCircle2, ChevronRight, X, Loader2, AlertCircle, Sun, Moon, History } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useBarcode } from '../hooks/useBarcode';
import { playBeep } from '../utils/audio';
import { useTheme } from '../hooks/useTheme';
import { tenantConfig } from '../config/tenant';

export default function Coleta() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [items, setItems] = useState([]);
  const [isProcessingCode, setIsProcessingCode] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [showHistory, setShowHistory] = useState(false); // Nova Visão de Histórico!

  // Mock Data para a nova tela de histórico do usuário final
  const historicoMocks = [
    { data: 'Hoje, 14:30', itens: 3, total: 34.50, status: 'Faturado Sankhya (NFS-0182)' },
    { data: 'Hoje, 11:15', itens: 1, total: 12.00, status: 'Aguardando Sincronização Cloud' },
    { data: 'Ontem, 16:45', itens: 5, total: 89.90, status: 'Faturado Sankhya (NFS-0105)' },
  ];

  useBarcode(async (barcode) => {
    if (isProcessingCode || isFinishing || showHistory) return; // Nao lemos barcodes na tela de historico
    await handleScanProduct(barcode);
  });

  const handleScanProduct = async (barcode) => {
    setIsProcessingCode(true);
    setAlertMsg('');
    try {
      const { data, error } = await supabase
        .from('produtos_cache')
        .select('*')
        .eq('codigo_barras', barcode)
        .single();

      if (error || !data) {
        playBeep('error');
        setAlertMsg(`Código '${barcode}' não encontrado.`);
        setTimeout(() => setAlertMsg(''), 4000);
        return;
      }
      playBeep('success');
      setItems(prev => {
        const existe = prev.find(item => item.codigo_barras === barcode);
        if (existe) {
          return prev.map(item => item.codigo_barras === barcode ? { ...item, qty: item.qty + 1 } : item);
        } else {
          return [...prev, { codigo_barras: data.codigo_barras, id_sankhya: data.codigo_produto_sankhya, name: data.descricao, qty: 1, price: Number(data.valor_unitario)}];
        }
      });
    } catch (err) {
      console.error(err);
      playBeep('error');
      setAlertMsg("Erro de comunicação com o banco.");
    } finally {
      setIsProcessingCode(false);
    }
  };

  const removeItem = (codigo_barras) => { setItems(items.filter(item => item.codigo_barras !== codigo_barras)); };
  const totalAmount = items.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const processCheckout = async () => {
    if (items.length === 0) return;
    setIsFinishing(true);
    try {
      const parceiroLogado = 50409; 
      const { data: compraData, error: errCabecalho } = await supabase.from('compras_cabecalho').insert([{ cod_parceiro: parceiroLogado, status_sync: 'pendente' }]).select().single();
      if (errCabecalho) throw errCabecalho;

      const insertsItens = items.map(i => ({ id_compra: compraData.id, codigo_barras: i.codigo_barras, quantidade: i.qty, preco_unitario: i.price }));
      const { error: errItens } = await supabase.from('compras_itens').insert(insertsItens);
      if (errItens) throw errItens;

      playBeep('success');
      setAlertMsg('Compra agregada no servidor! A sincronização rodará logo.');
      setItems([]);
      setTimeout(() => setAlertMsg(''), 5000);
    } catch (e) {
      console.error(e);
      playBeep('error');
      alert("Falha crítica ao gravar. Tente Novamente.");
    } finally {
      setIsFinishing(false);
    }
  }


  return (
    <div style={{ display: 'flex', height: '100vh', padding: '16px', gap: '16px' }}>
      
      {/* Esquerda: Terminal de Leitura OU TELA DE HISTORICO (Toggled) */}
      <div style={{ flex: '7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Cabecalho Principal (Topo Esquerdo) */}
        <header className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             {tenantConfig.logoUrl && (
               <div style={{ 
                  background: tenantConfig.forceLightBackgroundForLogo ? '#fff' : 'transparent',
                  padding: tenantConfig.forceLightBackgroundForLogo ? '8px 12px' : '0',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center'
               }}>
                   <img src={tenantConfig.logoUrl} alt="Logo" style={{ height: '32px' }} />
               </div>
             )}
             <div>
               <h2 style={{ margin: 0, fontSize: '24px' }}>Parceiro: <span style={{ color: 'var(--accent)' }}>50409</span></h2>
               <p style={{ margin: '2px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>{tenantConfig.companyName}</p>
             </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* NOVO: Alternar entre o App de Compras e o Historico da pessoa */}
            <button className="btn btn-secondary" onClick={() => setShowHistory(!showHistory)} style={{ color: 'var(--text-main)' }}>
               <History size={18}/> {showHistory ? 'Voltar para Carrinho' : 'Minhas Notas'}
            </button>
            <button className="btn btn-secondary" onClick={toggleTheme} title="Alternar Modo">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ fontSize: '15px' }}>
              <LogOut size={18} /> Sair
            </button>
          </div>
        </header>

        {showHistory ? (
          /* ===================================== */
          /* MÓDULO: HISTÓRICO PESSOAL DO USUARIO  */
          /* ===================================== */
          <div className="glass-panel" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 32px 0', fontSize: '28px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <History color="var(--accent)"/> Acompanhamento de Faturamentos Autorizados
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {historicoMocks.map((hist, idx) => (
                <div key={idx} style={{ 
                  padding: '24px', background: 'var(--card-bg)', border: '1px solid var(--border)', 
                  borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-main)' }}>Data Carga: {hist.data}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Cesta enviada: {hist.itens} produtos</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>R$ {hist.total.toFixed(2)}</div>
                    <span style={{ 
                      background: hist.status.includes('Aguardando') ? 'rgba(234, 179, 8, 0.1)' : 'rgba(33, 168, 79, 0.1)', 
                      color: hist.status.includes('Aguardando') ? '#eab308' : 'var(--success)',
                      padding: '6px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 600
                    }}>
                      {hist.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        ) : (
          /* ===================================== */
          /* MÓDULO: SCANNER PADRÃO DO VAREJO      */
          /* ===================================== */
          <div className="glass-panel" style={{ 
            flex: 1, display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
          }}>
             <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle, rgba(94, 17, 224,0.05) 0%, rgba(0,0,0,0) 60%)', pointerEvents: 'none' }}></div>
  
            <div style={{
              width: '240px', height: '240px', borderRadius: '32px',
              border: isProcessingCode ? '2px solid var(--accent)' : '2px dashed var(--accent)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '32px', backgroundColor: 'rgba(94, 17, 224, 0.05)', position: 'relative'
            }}>
              {isProcessingCode ? <Loader2 size={80} color="var(--accent)" className="spin-anim" /> : <ScanLine size={80} color="var(--accent)" />}
              {!isProcessingCode && <div className="scan-animation" style={{ position: 'absolute', top: '10%', left: '0', right: '0', height: '2px', background: 'var(--accent)', boxShadow: '0 0 16px var(--accent)' }}></div>}
            </div>
            
            <h2 style={{margin: '0 0 8px 0', fontSize: '28px', zIndex: 1, textAlign: 'center'}}>
               {isProcessingCode ? 'Validando...' : 'Aguardando Leitura'}
            </h2>
            <p style={{margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '18px', zIndex: 1, textAlign: 'center'}}>
               Aponte seu equipamento ou digite manualmente:
            </p>
  
            <form onSubmit={(e) => { e.preventDefault(); if (manualCode.trim()){ handleScanProduct(manualCode.trim()); setManualCode(''); } }} style={{ zIndex: 1, display: 'flex', gap: '8px', width: '80%', maxWidth: '300px' }}>
              <input type="text" className="input-field" placeholder="Ex: 123" value={manualCode} onChange={(e) => setManualCode(e.target.value)} disabled={isProcessingCode} style={{ padding: '12px', background: 'var(--panel-bg)' }} />
              <button type="submit" className="btn" style={{ padding: '12px 20px', color: 'var(--btn-text)' }} disabled={isProcessingCode || !manualCode.trim()}>Add</button>
            </form>
  
            {alertMsg && (
              <div style={{
                 position: 'absolute', bottom: '40px', padding: '16px 24px', 
                 background: alertMsg.includes('enviada') || alertMsg.includes('agregada') ? 'rgba(33, 168, 79, 0.2)' : 'rgba(224, 50, 43, 0.2)',
                 border: alertMsg.includes('enviada') || alertMsg.includes('agregada') ? '1px solid var(--success)' : '1px solid var(--danger)',
                 borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10
              }}>
                {alertMsg.includes('enviada') || alertMsg.includes('agregada') ? <CheckCircle2 color="var(--success)"/> : <AlertCircle color="var(--danger)"/> }
                <span style={{ fontWeight: 600 }}>{alertMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Direita: Carrinho Inteligente Permanente */}
      <div className="glass-panel" style={{ flex: '5', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '22px' }}>
            <PackageOpen size={24} color="var(--accent)"/> Resumo do Carrinho
          </h2>
        </div>

        <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item) => (
            <div key={item.codigo_barras} style={{ 
              background: 'var(--card-bg)', padding: '16px 20px', borderRadius: '16px',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 500 }}>{item.name}</h4>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '15px' }}>
                  <span style={{ border: '1px solid var(--border)', background: 'var(--card-bg)', padding: '4px 8px', borderRadius: '6px' }}>{item.qty}x</span>
                  <span style={{ display: 'flex', alignItems: 'center'}}>R$ {item.price.toFixed(2)} un</span>
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                R$ {(item.qty * item.price).toFixed(2)}
                <button onClick={() => removeItem(item.codigo_barras)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
              Nenhum item adicionado.<br/>Passe o primeiro código ou revise o histórico.
            </div>
          )}
        </div>

        <div style={{ padding: '32px', borderTop: '1px solid var(--border)', background: 'var(--panel-bg)', borderRadius: '0 0 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 500 }}>Valor Total Pedido</span>
            <span style={{ fontSize: '42px', fontWeight: 700, color: 'var(--success)', lineHeight: 1 }}>
              R$ {totalAmount.toFixed(2)}
            </span>
          </div>
          
          <button 
             className="btn btn-success" 
             onClick={processCheckout}
             disabled={items.length === 0 || isFinishing}
             style={{ width: '100%', padding: '20px', fontSize: '18px', opacity: (items.length === 0 || isFinishing) ? 0.5 : 1, color: '#fff' }} 
          >
            {isFinishing ? 'Alocando Pedido...' : 'Salvar Nota e Enviar'} <ChevronRight size={24} color="#fff" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scanAnim {
          0% { transform: translateY(-30px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(180px); opacity: 0; }
        }
        .scan-animation { animation: scanAnim 2.5s infinite ease-in-out alternate; }
        @keyframes spinner { to {transform: rotate(360deg);} }
        .spin-anim { animation: spinner 1s linear infinite; }
      `}</style>
    </div>
  );
}
