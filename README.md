# 💰 Bora Lá? 
## O seu gerenciador financeiro & planejador de metas - Frontend

Este é o repositório do **Frontend** do Gerenciador Financeiro Pessoal e Planejador de Metas de Economia. A aplicação foi desenvolvida em **Angular 21** e oferece uma interface moderna, responsiva e dinâmica para que os usuários possam gerenciar suas receitas, despesas e acompanhar o progresso de suas metas de economia em tempo real.

---

## 🚀 Funcionalidades Principais

*   **Autenticação Completa**:
    *   Cadastro de novos usuários com validação de e-mail.
    *   Login seguro com armazenamento de token JWT.
    *   Recuperação de senha (Recovery).

*   **Painel Geral (Dashboard)**:
    *   Gráficos interativos utilizando `Chart.js` e `ng2-charts`.
    *   Visualização rápida de Saldo Atual, Total de Receitas e Total de Despesas.
    *   Detalhamento de despesas agrupadas por categorias.
    *   Visualização rápida do progresso das metas financeiras ativas.
*   **Gerenciador de Transações**:
    *   Cadastro, edição e exclusão de receitas e despesas.
    *   Associação inteligente de transações a metas específicas (ex: aportes ou resgates).
*   **Planejador de Metas**:
    *   Criação e acompanhamento de metas de economia (ex: viagem, fundo de reserva).
    *   Visualização de barras de progresso dinâmicas em porcentagem.
    *   Sincronização em tempo real: ao adicionar um aporte (despesa associada a uma meta) ou resgate (receita associada), o valor atual da meta é atualizado automaticamente.

---

## 🛠️ Tecnologias Utilizadas

*   **Framework Principal**: [Angular](https://angular.dev/) (v21.2.0)
*   **Estilização**: CSS Moderno (Vanilla CSS com variáveis e design system responsivo)
*   **Gráficos**: [Chart.js](https://www.chartjs.org/) & [ng2-charts](https://valor-software.com/ng2-charts/)
*   **Roteamento e Proteção**: Angular Router com `authGuard`
*   **Renderização**: Server-Side Rendering (SSR) habilitado para melhor performance

---

## ⚙️ Pré-requisitos e Instalação

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
*   [Node.js](https://nodejs.org/) (Recomendado v20 ou superior)
*   [npm](https://www.npmjs.com/) (Gerenciador de pacotes do Node)
*   **API (Backend)** em execução. O backend em Node.js/Express deve estar rodando (normalmente na porta `5000`).

### 2. Configuração do Backend
Para que o frontend funcione corretamente, você deve configurar e rodar o repositório do backend. Vá até o repositório do backend e configure-o antes de rodar o frontend.

### 3. Configuração do Frontend

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   cd NOME-DO-REPOSITORIO
   ```

2. **Instalar as Dependências**:
   No diretório raiz do frontend, execute:
   ```bash
   npm install
   ```

3. **Iniciar o Servidor de Desenvolvimento**:
   Para rodar localmente a aplicação frontend:
   ```bash
   npm start
   ```
   Acesse no navegador: `http://localhost:4200/`.

---
