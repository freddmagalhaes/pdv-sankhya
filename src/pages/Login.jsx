import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, LogIn, Store, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { tenantConfig } from '../config/tenant';

export default function Login() {
  const [partnerCode, setPartnerCode] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (partnerCode) {
      navigate('/coleta');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', padding: '24px', gap: '24px', position: 'relative' }}>
      
      {/* Botão de Tema Flutuante */}
      <button 
        onClick={toggleTheme} 
        style={{ 
          position: 'absolute', top: 36, right: 36, zIndex: 10, 
          background: 'var(--panel-bg)', border: '1px solid var(--border)', 
          borderRadius: '50%', padding: '12px', cursor: 'pointer', 
          color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
        title="Alternar Tema"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Banner Esquerda: Branding */}
      <div style={{
        flex: 1, 
        background: `linear-gradient(135deg, var(--accent) 0%, var(--bg-color) 100%)`,
        borderRadius: '24px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px', position: 'relative', overflow: 'hidden',
        border: '1px solid var(--border)'
      }}>
        {/* Glow dinâmico no fundo */}
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none', borderRadius: '50%'
        }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
          <div style={{ 
            background: tenantConfig.forceLightBackgroundForLogo ? '#ffffff' : 'var(--card-bg)', 
            border: tenantConfig.forceLightBackgroundForLogo ? 'none' : '1px solid var(--border)', 
            borderRadius: '16px', 
            display: 'flex', 
            padding: '12px 24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {tenantConfig.logoUrl ? (
               <img src={tenantConfig.logoUrl} alt={tenantConfig.companyName} style={{ height: '40px', objectFit: 'contain' }} />
            ) : (
               <>
                 <ShoppingCart size={28} color={tenantConfig.forceLightBackgroundForLogo ? '#000' : 'var(--text-main)'} />
                 <h2 style={{ margin: '0 0 0 12px', fontWeight: 700, fontSize: '22px', color: tenantConfig.forceLightBackgroundForLogo ? '#000' : 'var(--text-main)' }}>
                   {tenantConfig.companyName}
                 </h2>
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
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Entre com seus dados do Sankhya</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="input-label">Código do Parceiro</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="Exemplo: 50409"
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">PIN</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn" style={{ marginTop: '16px', width: '100%', padding: '16px', color: 'var(--btn-text)' }}>
              Acessar Ponto de Coleta <LogIn size={20} color="var(--btn-text)" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
