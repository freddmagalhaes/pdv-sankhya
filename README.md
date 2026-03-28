# 🛒 App PDV B2B Multi-Tenant (Sankhya + React)

Um aplicativo moderno de Ponto de Venda (PDV) e Coleta de Produtos projetado para distribuidoras e varejistas. Arquitetado nativamente para ser **Multi-Tenant** (Múltiplas Empresas em uma base), permitindo que centenas de clientes utilizem a mesma base de código mantendo suas identidades visuais e bancos de dados 100% isolados.

Integração desenhada para ser assíncrona com o ERP **Sankhya**.

---

## 🚀 Principais Funcionalidades

- **Ponto de Coleta e Scanner Dinâmico:** Hook ultrarrápido (`useBarcode`) com suporte a leitores de código de barras a laser e digitação manual falha-segura, com feedback auditivo moderno (Web Audio API) ao validar itens no catálogo.
- **Isolamento de Segurança (Multi-Tenant):** Segurança imposta pela camada profunda do Banco de Dados via RLS (*Row Level Security*) do Supabase. A Empresa A jamais terá acesso ou visibilidade dos faturamentos da Empresa B.
- **Painel do Gestor Administrativo:** Relatórios integrados em tempo real com Curva ABC de vendas (faturamento e volumetria) e Funil de Status de Integração com a filial do sistema ERP.
- **Parametrização Nativa da Nuvem:** Cada filial/empresa gerencia suas próprias credenciais MGE da Sankhya direto no App, sem necessidade de chaves `.env` expostas globalmente.
- **Theming Dinâmico (White-Label):** Injeção de cores personalizadas e modo Dark/Light que capta automaticamente a logotipo, nome e "Accent Color" primária da distribuidora cliente assim que seu respectivo domínio ou base estática acessa a plataforma (`tenant.js`).
- **Cashier Histórico UX:** O próprio Operador da Ponta acompanha se as suas vendas foram faturadas individualmente na aba do App sem sair do terminal.

## 🛠️ Stack Tecnológica
- **Frontend / Client:** React 18, Vite, Lucide React (Ícones e UX).
- **Backend / Infra (BaaS):** Supabase Platform, PostgreSQL.
- **Integração Background / Edge:** Deno (Rotina de Sync MGE API).
- **ERP Base (Integração):** MGE API (Sankhya Om).

## 💻 Como Executar o Projeto
Pré-requisitos mínimos: **Node.js 18+** e **NPM** (ou Yarn/PNPM).

1. Clone este repositório:
```bash
git clone https://github.com/programadorpython03/pdv-sankhya.git
cd pdv-sankhya
```

2. Instale as dependências essenciais de pacote (como React Router e Lucide):
```bash
npm install
```

3. Configure a Chave Pública do Banco:
Crie um arquivo `.env.local` não-rastreável na raiz do repositório para expor suas chaves anônimas do Supabase:
```env
VITE_SUPABASE_URL=sua_url_https_supa
VITE_SUPABASE_ANON_KEY=codigo_longo_jwt_da_chave_anon_key
```

4. Suba o servidor de desenvolvimento:
```bash
npm run dev
```

### 🗝️ Usuários de Testes Injetáveis (Seed)
Para facilitar testes da equipe sem a necessidade de criar a hierarquia manual no SQL do Supabase, nós embutimos atalhos de *Seed*. 

Na tela de **Login** (rota principal do sistema), você pode utilizar as seguintes credenciais para criação e acesso dinâmico:
- **Super-Admin (Gestor)**: Parceiro **`9999`** com PIN **`admin123`**. Fornece acesso ao Painel Gerencial e Auditoria.
- **Operador Comum (Lojista)**: Parceiro **`1111`** com PIN **`user123`**. Fornece acesso ao Ponto de Coleta e Scanner.

Se esta for a primeira vez que você acessa com qualquer um destes, o aplicativo se encarregará de criar esse usuário nativamente na Autenticação do Supabase com os níveis de acesso já mastigados (`admin_global` ou `operador`).

### 🛣️ Mapa de Rotas do Sistema
A aplicação roda por padrão em `http://localhost:5173` e possui a seguinte estrutura de rotas ativa:
- **`/` (Raiz)**: Tela de Autenticação (Login). Redireciona o usuário pós-login baseado no seu Perfil (`nivel_acesso`).
- **`/compras`**: Terminal de Coleta inteligente, histórico e fechamento de pedidos.
- **`/admin`**: Dashboard de Análises Administrativas e logs de Sincronização.

*Dica: Caso a imagem da sua logo (ou da sua empresa cliente) suma da tela de Login, basta arrastar e substituir a imagem `logo.png` na pasta `/public/` do projeto.*

## 🔒 Arquitetura de Dados (Multicliente)
Para o funcionamento adequado da estrutura multicliente, é estritamente proibido rodar os painéis sem ter a rotina de Segurança do PostgreSQL ativada pelo Supabase. O banco de dados valida automaticamente o ID da filial através da tabela estrutural `public.empresas` mapeando cada usuário via `public.parceiros_usuarios`. Isso protege APIs e evita vazamento de dados corporativos.

## 🤝 Fluxograma do Job Sankhya (Sincronização Ativa)
O aplicativo local armazena os dados das vendas em cache (`compras_cabecalho` / `itens` com status 'pendente'). O Supabase interage com as credenciais cadastradas nativamente no App (Abas de Integrações) efetuando as chamadas para autenticar, alocar notas fiscais e atualizar seu status para 'faturado'/'sincronizado' utilizando o `MobileLoginSP` e regras da framework MGE.
