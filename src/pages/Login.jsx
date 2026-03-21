import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, LogIn, Store, Sun, Moon, AlertCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { tenantConfig } from '../config/tenant';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [partnerCode, setPartnerCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!partnerCode || !password) return;
    setLoading(true);
    setErrorMsg('');

    try {
      /* ============================================================ */
      /* SHORTCUT / BACKDOOR DE TESTES: CRIAÇÃO DO SUPER ADMIN 9999   */
      /* ============================================================ */
      if (partnerCode === '9999' && password === 'admin123') {
         const fakeEmailForAdmin = 'master@pdvsankhya.local';
         let { data: inData, error: signInErr } = await supabase.auth.signInWithPassword({ email: fakeEmailForAdmin, password });
         
         // Se der erro, é porque o Gestor Master ainda não existe. Vamos forçar a criação no Supabase!
         if (signInErr) {
             const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ email: fakeEmailForAdmin, password });
             if (signUpErr) throw new Error(`Login Dito: ${signInErr.message}. E Cadastro Dito: ${signUpErr.message}`);
             
             if(signUpData?.user) {
                 // Insere a referência do parceiro. Obs: Só vai funcionar se você desabilitar temporariamente
                 // o RLS de insert da tabela public.parceiros_usuarios no seu painel DB!
                 await supabase.from('parceiros_usuarios').insert({
                     id: signUpData.user.id,
                     codigo_parceiro_sankhya: 9999,
                     nome: 'Sankhya Administrador (Seed)',
                     nivel_acesso: 'admin_global'
                 });
             }
         }
         navigate('/admin');
         return;
      }

      /* ============================================================ */
      /* LOGIN OFICIAL DO OPERADOR / LOJISTA COMUM NA PLATAFORMA      */
      /* ============================================================ */
      const email = `${partnerCode}@pdvsankhya.local`;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
         setErrorMsg("Código de Parceiro ou Senha (PIN) Inválidos.");
         setLoading(false);
         return;
      }

      // Redirecionamento Dinâmico por Papel (Role)
      if(data?.user) {
         const { data: perfil } = await supabase.from('parceiros_usuarios').select('nivel_acesso').eq('id', data.user.id).single();
         if(perfil && (perfil.nivel_acesso === 'gestor' || perfil.nivel_acesso === 'admin_global')) {
             navigate('/admin');
         } else {
             navigate('/coleta');
         }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(`Bloqueado: ${err.message || 'Falha de comunicação'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', padding: '24px', gap: '24px', position: 'relative' }}>
      
      {/* Botão de Tema Flutuante */}
      <button onClick={toggleTheme} style={{ 
          position: 'absolute', top: 36, right: 36, zIndex: 10, background: 'var(--panel-bg)', border: '1px solid var(--border)', 
          borderRadius: '50%', padding: '12px', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }} title="Alternar Tema">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Banner Esquerda: Branding */}
      <div style={{
        flex: 1, background: `linear-gradient(135deg, var(--accent) 0%, var(--bg-color) 100%)`, borderRadius: '24px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)'
      }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', borderRadius: '50%' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
          <div style={{ 
            background: tenantConfig.forceLightBackgroundForLogo ? '#ffffff' : 'var(--card-bg)', border: tenantConfig.forceLightBackgroundForLogo ? 'none' : '1px solid var(--border)', 
            borderRadius: '16px', display: 'flex', padding: '12px 24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {tenantConfig.logoUrl ? (
               <img src={tenantConfig.logoUrl} alt={tenantConfig.companyName} style={{ height: '40px', objectFit: 'contain' }} />
            ) : (
               <>
                 <ShoppingCart size={28} color={tenantConfig.forceLightBackgroundForLogo ? '#000' : 'var(--text-main)'} />
                 <h2 style={{ margin: '0 0 0 12px', fontWeight: 700, fontSize: '22px', color: tenantConfig.forceLightBackgroundForLogo ? '#000' : 'var(--text-main)' }}>{tenantConfig.companyName}</h2>
               </>
            )}
          </div>
        </div>

        <div style={{ zIndex: 1 }}>
          <h1 style={{ fontSize: '56px', margin: '0 0 20px 0', lineHeight: 1.05, letterSpacing: '-1.5px', color: 'var(--text-main)' }}>
            Registro de<br/> Coleta Inteligente.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '400px', lineHeight: 1.5 }}>
            Identifique-se como Parceiro autorizado para iniciar o registro e envio de pedidos.
          </p>
        </div>
      </div>

      {/* Caixa da Direita: Login Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '48px' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
              <Store size={36} color="var(--accent)" />
            </div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', letterSpacing: '-0.5px' }}>Iniciar Nova Sessão</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Entre com seus dados do Lojista</p>
          </div>

          {errorMsg && (
             <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '12px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <AlertCircle size={16}/> {errorMsg}
             </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="input-label">Código do Parceiro Sankhya</label>
              <input type="number" className="input-field" placeholder="Exemplo: 50409" value={partnerCode} onChange={(e) => setPartnerCode(e.target.value)} disabled={loading} required />
            </div>
            <div>
              <label className="input-label">Identificação PIN</label>
              <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
            </div>

            <button type="submit" className="btn" disabled={loading} style={{ marginTop: '16px', width: '100%', padding: '16px', color: 'var(--btn-text)' }}>
              {loading ? 'Validando Acessos...' : 'Acessar Ponto de Coleta'} {!loading && <LogIn size={20} color="var(--btn-text)" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
