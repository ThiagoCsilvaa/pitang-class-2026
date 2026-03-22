# 🚀 Thiago.Store - E-commerce Dashboard

Uma plataforma de e-commerce moderna desenvolvida como parte do treinamento da **Pitang**, focada em performance, design minimalista e uma experiência de usuário fluida.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as ferramentas mais modernas do ecossistema Web:

* **React 19**: A última versão da biblioteca para interfaces reativas.
* **Vite**: Bundler de próxima geração para um desenvolvimento ultra-rápido.
* **TypeScript**: Garantia de tipagem estática e segurança no código.
* **Tailwind CSS 4**: Estilização baseada em utilitários com foco em performance.
* **TanStack Router**: Gerenciamento de rotas com segurança de tipos (Type-safe).
* **Zustand**: Gerenciamento de estado leve e persistente para o carrinho de compras.
* **Base UI**: Componentes acessíveis e sem estilização forçada para maior liberdade de design.
* **Lucide React**: Biblioteca de ícones modernos e leves.
* **Sonner**: Sistema de notificações (Toasts) elegante e funcional.

## ⚙️ Funcionalidades

- [x] **Autenticação**: Sistema de login integrado com a API DummyJSON.
- [x] **Refresh Token**: Renovação automática de sessão com aviso de expiração via Modal.
- [x] **Catálogo de Produtos**: Listagem dinâmica com troca de visualização (Grid/Tabela) e paginação.
- [x] **Carrinho de Compras**: Persistência de dados no LocalStorage utilizando Zustand.
- [x] **Dashboard Administrativo**: Visão geral de métricas, estoque e distribuição por categorias.
- [x] **Gestão de Usuários**: Busca em tempo real e paginação de clientes cadastrados.
- [x] **Design Responsivo**: Adaptado para dispositivos móveis e desktop.

## 🧠 Dificuldades Encontradas

Durante o desenvolvimento, os principais desafios foram:

1.  **Configuração do TanStack Router**: A migração para um roteador 100% type-safe exigiu atenção na estrutura de pastas e na geração automática do `routeTree.gen.ts`.
2.  **Ciclo de Vida do Token**: Implementar a lógica de `refresh token` de forma que a experiência do usuário não fosse interrompida, garantindo a segurança dos cookies.
3.  **Hospedagem na Vercel**: Ajustar as configurações de reescrita de rotas (`vercel.json`) para que as rotas do roteador funcionassem corretamente após o deploy (evitando erro 404).
4.  **Tailwind CSS 4**: Adaptação às novas diretivas de importação e ao sistema de cores OKLCH, que oferece maior precisão cromática mas exige uma curva de aprendizado diferente do RGB/HEX tradicional.

## 🚀 Como rodar o projeto localmente

1. Clone o repositório:
   bash
git clone [https://github.com/ThiagoCsilvaa/pitang-class-2026.git](https://github.com/ThiagoCsilvaa/pitang-class-2026.git)

2. Instale as dependências:
   npm install

3. Inicie o servidor de desenvolvimento:
   npm run dev
Desenvolvido por Thiago Cavalcanti - 2026


---

### Como adicionar este arquivo:
1. No VS Code, crie um novo arquivo na pasta raiz chamado `README.md`.
2. Cole o código acima.
3. Salve, dê um `git add .`, `git commit -m "docs: adiciona readme detalhado"` e `git push`.

**Quer que eu te ajude a adicionar um print do site no README ou o link direto da Vercel para o professor clicar?** Isso ajuda muito na nota!
