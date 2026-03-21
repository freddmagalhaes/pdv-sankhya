import { useState, useEffect } from 'react';
import { tenantConfig } from '../config/tenant';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sankhya-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sankhya-theme', theme);

    // Injeção Multi-Tenant (Tema de Cores da Empresa Dinâmico!)
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--accent', tenantConfig.colors.dark.accent);
      root.style.setProperty('--accent-hover', tenantConfig.colors.dark.accentHover);
    } else {
      root.style.setProperty('--accent', tenantConfig.colors.light.accent);
      root.style.setProperty('--accent-hover', tenantConfig.colors.light.accentHover);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}
