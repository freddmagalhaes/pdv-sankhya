export const tenantConfig = {
  // Nome da Empresa
  companyName: "DVL Distribuidora",
  
  // Caminho da Logo (Colocar a imagem na pasta /public/ do projeto)
  logoUrl: "/logo.png",  

  // Caso a logo tenha textos escuros (como a da DVL), forçar um fundo branco no Container 
  // ajuda a ficar 100% visível e bonita mesmo se o usuário estiver usando o Tema Dark!
  forceLightBackgroundForLogo: true,
  
  // Cores da Identidade Visual da Empresa (Injetadas automaticamente nos painéis e botões)
  colors: {
    dark: {
      accent: "#009ca6", // Ciano (dos pontos da DVL) para ter destaque no fundo escuro
      accentHover: "#00b5c2"
    },
    light: {
      accent: "#003f69", // Azul escuro corporativo DVL para o fundo claro
      accentHover: "#00558a"
    }
  }
};
