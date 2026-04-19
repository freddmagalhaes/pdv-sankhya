export const tenantConfig = {
  // Definição do nome da empresa para exibição no front-end
  companyName: "DVL Distribuidora",
  
  // Rota do arquivo de logomarca (necessário armazenar o asset na pasta /public/)
  logoUrl: "/logo.png",  

  // Flag para aplicar fundo branco no container da logo
  // Solução adotada para manter a legibilidade da logo da DVL quando o tema dark estiver ativo
  forceLightBackgroundForLogo: true,
  
  // Configuração da paleta de cores da marca para uso nos componentes de UI (painéis, botões, etc)
  colors: {
    dark: {
      accent: "#009ca6", // Ciano (referência da marca DVL) para melhor contraste no tema escuro
      accentHover: "#00b5c2"
    },
    light: {
      accent: "#003f69", // Azul corporativo padrão da empresa utilizado no tema claro
      accentHover: "#00558a"
    }
  }
};
