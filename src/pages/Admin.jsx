import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Users, LogOut, TrendingUp, ArrowUpRight, Package, Database, Edit, Trash2, Terminal } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { tenantConfig } from '../config/tenant';

export default function AdminDashboard() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  /* MOCKS - INDICADORES E RELATORIOS */
  const kpis = [
    { title: "Compras Hoje", value: "24", trend: "+12%" },
    { title: "Itens Bipados", value: "156", trend: "+5%" },
    { title: "Faturamento Pendente", value: "R$ 4.250,00", trend: "+20%" }
  ];

  const recentOrders = [
    { id: "NFS-0012", operario: "João (50409)", data: "Hoje, 14:30", itens: 4, total: "R$ 150,00", status: "Sincronizado" },
    { id: "NFS-0013", operario: "Maria (50410)", data: "Hoje, 15:15", itens: 1, total: "R$ 45,00", status: "Pendente" },
  ];

  const produtosTop = [
    { nome: "Coca Cola 2L", vendas: 342, receita: "R$ 3.420,00" },
    { nome: "Bolo de Pote Ninho", vendas: 215, receita: "R$ 1.250,00" },
    { nome: "Salgado Assado Frango", vendas: 180, receita: "R$ 1.800,00" },
    { nome: "Suco Laranja Integral", vendas: 120, receita: "R$ 840,00" },
  ];

  /* NÓVO MOCK - OPERADORES (CADA EMPRESA TEM OS SEUS) */
  const operators = [
    { nome: "João Silva", codigo: "50409", cargo: "Operador", status: "Ativo" },
    { nome: "Maria Oliveira", codigo: "50410", cargo: "Operador", status: "Ativo" },
    { nome: "Carlos Souza", codigo: "50415", cargo: "Gestor", status: "Ativo" },
    { nome: "Ana Costa", codigo: "50422", cargo: "Operador", status: "Bloqueado" }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Menu Lateral da Empresa */}
      <aside style={{ width: '280px', borderRight: '1px solid var(--border)', background: 'var(--panel-bg)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
             {tenantConfig.logoUrl ? (
               <div style={{ 
                  background: tenantConfig.forceLightBackgroundForLogo ? '#fff' : 'transparent',
                  padding: tenantConfig.forceLightBackgroundForLogo ? '4px 8px' : '0',
                  borderRadius: '8px'
               }}>
                   <img src={tenantConfig.logoUrl} alt="Logo" style={{ height: '32px', display: 'block' }} />
               </div>
             ) : (
                <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: '8px' }}></div>
             )}
          <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-main)' }}>Painel Gestor</span>
        </div>
        
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20}/> Visão Geral
          </button>
          <button className={`admin-nav-btn ${activeTab === 'relatorios' ? 'active' : ''}`} onClick={() => setActiveTab('relatorios')}>
            <FileText size={20}/> Relatórios
          </button>
          <button className={`admin-nav-btn ${activeTab === 'operadores' ? 'active' : ''}`} onClick={() => setActiveTab('operadores')}>
            <Users size={20}/> Parceiros/Equipe
          </button>
          <button className={`admin-nav-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
            <Terminal size={20}/> Auditoria (Logs)
          </button>
          <button className={`admin-nav-btn ${activeTab === 'integracao' ? 'active' : ''}`} onClick={() => setActiveTab('integracao')} style={{ borderTop: '1px solid var(--border)', borderRadius: 0, marginTop: '8px', paddingTop: '16px' }}>
            <Database size={20}/> Integração Sankhya
          </button>
          <button className={`admin-nav-btn ${activeTab === 'configs' ? 'active' : ''}`} onClick={() => setActiveTab('configs')}>
            <Settings size={20}/> Controle do App
          </button>
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', color: 'var(--btn-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              GF
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>Seu Nome</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Gerente ({tenantConfig.companyName})</p>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', padding: '10px' }} onClick={() => navigate('/')}>
            <LogOut size={16}/> Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo Central */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', color: 'var(--text-main)' }}>
               {activeTab === 'dashboard' ? 'Resultados Gerais' : 
                activeTab === 'relatorios' ? 'Relatórios de Inteligência' : 
                activeTab === 'operadores' ? 'Controle de Operadores' : 
                activeTab === 'logs' ? 'Monitoramento e Diagnóstico' : 
                activeTab === 'integracao' ? 'Configuração Contábil (ERP)' : 'Administração'}
            </h1>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)' }}>Administração Local de {tenantConfig.companyName}</p>
          </div>
          <button onClick={toggleTheme} className="btn btn-secondary" style={{ borderRadius: '50%', padding: '12px' }} title="Trocar Tema">
             {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </header>

        {/* 1. VISÃO GERAL */}
        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              {kpis.map((kpi, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{kpi.title}</span>
                    <span style={{ background: 'rgba(33, 168, 79, 0.1)', color: 'var(--success)', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14}/> {kpi.trend}</span>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-main)' }}>{kpi.value}</div>
                </div>
              ))}
            </div>

            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>Últimas Sincronizações da Operação</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '14px', background: 'rgba(0,0,0,0.1)' }}>
                      <th style={{ padding: '16px 24px', fontWeight: 500 }}>Operador</th>
                      <th style={{ padding: '16px 24px', fontWeight: 500 }}>Data/Hora</th>
                      <th style={{ padding: '16px 24px', fontWeight: 500 }}>Itens</th>
                      <th style={{ padding: '16px 24px', fontWeight: 500 }}>Total</th>
                      <th style={{ padding: '16px 24px', fontWeight: 500 }}>Status do ERP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                        <td style={{ padding: '16px 24px', color: 'var(--text-main)' }}>{order.operario}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{order.data}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-main)' }}>{order.itens} un.</td>
                        <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-main)' }}>{order.total}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ background: order.status === 'Pendente' ? 'rgba(224, 178, 17, 0.1)' : 'rgba(33, 168, 79, 0.1)', color: order.status === 'Pendente' ? '#eab308' : 'var(--success)', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* 2. RELATÓRIOS (Curva ABC) */}
        {activeTab === 'relatorios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '32px' }}>
                 <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}><Package size={22} color="var(--accent)"/> Curva ABC de Produtos</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   {produtosTop.map((p, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-muted)' }}>{i+1}º</span>
                          <span style={{ fontSize: '16px', color: 'var(--text-main)', fontWeight: 500 }}>{p.nome}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', color: 'var(--text-main)', fontWeight: 600 }}>{p.vendas} un.</div>
                          <div style={{ fontSize: '14px', color: 'var(--success)' }}>{p.receita}</div>
                        </div>
                      </div>
                   ))}
                 </div>
              </div>

              <div className="glass-panel" style={{ padding: '32px' }}>
                 <h3 style={{ margin: '0 0 32px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}><FileText size={22} color="var(--accent)"/> Funil Faturamento Sankhya</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--text-main)', fontSize: '15px' }}>Compras Faturadas (NFS Gerada)</span><span style={{ fontWeight: 700, color: 'var(--success)' }}>85%</span></div>
                      <div style={{ height: '10px', background: 'var(--card-bg)', borderRadius: '5px', overflow: 'hidden' }}><div style={{ width: '85%', height: '100%', background: 'var(--success)' }}></div></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--text-main)', fontSize: '15px' }}>Aguardando Sinc. Server</span><span style={{ fontWeight: 700, color: '#eab308' }}>12%</span></div>
                      <div style={{ height: '10px', background: 'var(--card-bg)', borderRadius: '5px', overflow: 'hidden' }}><div style={{ width: '12%', height: '100%', background: '#eab308' }}></div></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--text-main)', fontSize: '15px' }}>Bloqueados API Oracle</span><span style={{ fontWeight: 700, color: 'var(--danger)' }}>3%</span></div>
                      <div style={{ height: '10px', background: 'var(--card-bg)', borderRadius: '5px', overflow: 'hidden' }}><div style={{ width: '3%', height: '100%', background: 'var(--danger)' }}></div></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. OPERADORES / EQUIPE (CRIAR E BLOQUEAR ACESSOS DA FRANQUIA) */}
        {activeTab === 'operadores' && (
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>Gestão do Seu Time de Vendas</h3>
                <button className="btn" style={{ padding: '10px 20px', fontSize: '15px', color: 'var(--btn-text)' }}>+ Adicionar Membro</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <th style={{ padding: '16px 32px', fontWeight: 600 }}>Nome do Parceiro</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Cód. Sankhya</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Permissão</th>
                      <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status do App</th>
                      <th style={{ padding: '16px 32px', fontWeight: 600, textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operators.map((op, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                        <td style={{ padding: '20px 32px', color: 'var(--text-main)', fontWeight: 500, fontSize: '16px' }}>{op.nome}</td>
                        <td style={{ padding: '20px 24px', color: 'var(--text-muted)' }}>{op.codigo}</td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ padding: '6px 12px', background: op.cargo === 'Gestor' ? 'rgba(94, 17, 224, 0.1)' : 'var(--card-bg)', color: op.cargo === 'Gestor' ? 'var(--accent)' : 'var(--text-muted)', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                            {op.cargo}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ color: op.status === 'Ativo' ? 'var(--success)' : 'var(--danger)', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{width: 8, height: 8, borderRadius: '50%', background: op.status === 'Ativo' ? 'var(--success)' : 'var(--danger)' }}></div>
                            {op.status}
                          </span>
                        </td>
                        <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                           <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '14px', marginRight: '8px' }} title="Editar"><Edit size={16}/></button>
                           <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '14px', color: 'var(--danger)', borderColor: 'transparent' }} title="Revogar MGE"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {/* 4. AUDITORIA E LOGS (SUPER ADMIN / GESTOR) */}
        {activeTab === 'logs' && (
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.15)' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Terminal size={20} color="var(--accent)"/> Log de Rastreamento Transparente
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Atividade detalhada de operadores e retornos do banco Oracle/Sankhya.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>Limpar Tela</button>
                  <button className="btn" style={{ padding: '8px 16px', fontSize: '14px', color: 'var(--btn-text)' }}>Exportar .CSV</button>
                </div>
              </div>
              
              <div style={{ padding: '24px', background: 'var(--panel-bg)'}}>
                 <div style={{ 
                    background: '#0a0a0a', border: '1px solid #333', borderRadius: '12px',
                    fontFamily: 'monospace', padding: '16px', overflowY: 'auto', maxHeight: '500px',
                    display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)'
                 }}>
                    {systemLogs.map((log, i) => (
                      <div key={i} style={{ 
                         display: 'flex', gap: '16px', fontSize: '13px', 
                         paddingBottom: '8px', borderBottom: i === systemLogs.length-1 ? 'none' : '1px solid #222',
                         color: '#ccc', lineHeight: 1.6
                      }}>
                         <span style={{ color: '#666', minWidth: '140px' }}>[{log.data}]</span>
                         <span style={{ minWidth: '90px' }}>
                           <span style={{ 
                             display: 'inline-block', width: '60px', textAlign: 'center',
                             background: log.nivel === 'ERROR' ? 'rgba(239, 68, 68, 0.2)' : log.nivel === 'WARN' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                             color: log.nivel === 'ERROR' ? '#ef4444' : log.nivel === 'WARN' ? '#eab308' : '#22c55e',
                             padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', letterSpacing: '1px'
                           }}>
                             {log.nivel}
                           </span>
                         </span>
                         <span style={{ color: '#8b5cf6', minWidth: '110px', fontWeight: 600 }}>{log.origem}</span>
                         <span style={{ color: log.nivel === 'ERROR' ? '#ef4444' : '#e5e5e5' }}>{log.mensagem}</span>
                      </div>
                    ))}
                 </div>
              </div>
          </div>
        )}

        {/* 5. CHAVES DE INTEGRAÇÃO DO ERP PARA ESTA EMPRESA */}
        {activeTab === 'integracao' && (
          <div className="glass-panel" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
               <div style={{ padding: '16px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--accent)' }}>
                  <Database size={36} color="var(--accent)" />
               </div>
               <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '24px', color: 'var(--text-main)' }}>Credenciais Nativas do ERP</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '16px' }}>Configure os canais exatos de envio das compras da distribuidora ({tenantConfig.companyName}).</p>
               </div>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
               <div>
                 <label className="input-label">URL da API do Servidor Sankhya (MGE)</label>
                 <input type="url" className="input-field" placeholder="https://api.sankhya.com.br/mge" defaultValue="https://api.dvldistribuidora.com.br/mge" />
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                 <div>
                   <label className="input-label">Usuário MGE (Robô de Inserção)</label>
                   <input type="text" className="input-field" defaultValue="INTEGRACAO_APP" />
                 </div>
                 <div>
                   <label className="input-label">Senha Global MGE Base64</label>
                   <input type="password" className="input-field" defaultValue="12345678" />
                 </div>
               </div>

               <div style={{ marginTop: '16px', padding: '24px', background: 'rgba(94, 17, 224, 0.05)', borderRadius: '16px', border: '1px solid rgba(94, 17, 224, 0.2)' }}>
                 <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-main)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>🛡️ Arquitetura Multi-Tenant Supabase</h4>
                 <p style={{ margin: '0 0 16px 0', color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
                   Estes dados jamais trafegam localmente nos celulares ou computadores de caixa. 
                   Ao salvar, as credenciais são <strong>criptografadas na tabela `public.empresas`</strong> na nuvem. A <br/>`Edge Function` localiza invisivelmente esses dados no Servidor Cloud de acordo com o `ID da Empresa` de quem está comprando, garantindo 100% de separação de clientes.
                 </p>
                 <button className="btn" style={{ color: 'var(--btn-text)' }}>Gravar Chaves e Testar Conexão</button>
               </div>
             </div>
          </div>
        )}

        {/* 5. MODO PANICO E CONFIGURAÇÔES GERAIS */}
        {activeTab === 'configs' && (
           /* Omitindo os codigos antigos para manter focado na MGE, mas ainda existe a aba */
           <div className="glass-panel" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ margin: '0 0 32px 0', fontSize: '22px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                Ações do Núcleo
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, paddingRight: '20px' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '18px' }}>Pausar App nas Lojas e Caixas</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.5 }}>Corta o fluxo, útil para momentos de Balanço ou falhas.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', minWidth: '180px' }}>Ativar Bloqueio</button>
                </div>
              </div>
           </div>
        )}

      </main>

      <style>{`
        .admin-nav-btn {
          background: transparent; border: none; color: var(--text-muted);
          padding: 14px 20px; border-radius: 12px; text-align: left;
          font-family: inherit; font-size: 15px; font-weight: 500;
          cursor: pointer; display: flex; alignItems: center; gap: 12px; transition: all 0.2s;
        }
        .admin-nav-btn:hover { background: var(--card-bg); color: var(--text-main); }
        .admin-nav-btn.active { background: var(--accent); color: var(--btn-text); }
        .table-row-hover:hover { background: var(--card-bg); }
      `}</style>
    </div>
  );
}
