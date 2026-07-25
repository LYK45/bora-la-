# Resumo Técnico do Backend: Gerenciador Financeiro & Planejador de Metas

Este documento contém a consolidação completa da arquitetura, regras de negócio, modelos de banco de dados e endpoints desenvolvidos no backend em **Node.js + TypeScript**.

---

## 📌 Visão Geral do Projeto

Aplicação backend RESTful construída para suportar um **Gerenciador Financeiro Pessoal e Planejador de Metas de Economia**.
*   **Tecnologias**: Node.js, TypeScript, Express, Mongoose (MongoDB Atlas), Bcryptjs, JsonWebToken (JWT) e Dotenv.
*   **Porta**: `5000`

---

## 📁 Estrutura de Arquivos e Pastas

```text
node-ts/
├── src/
│   ├── config/
│   │   └── database.ts            # Conexão com o MongoDB Atlas via MONGODB_URI
│   ├── models/
│   │   ├── Enum/
│   │   │   └── Tipo.ts            # Enum TypeScript para Tipo de Transação ('receita' | 'despesa')
│   │   ├── UserModel.ts           # Schema de Usuários (nome, email, senha)
│   │   ├── TransationModel.ts     # Schema de Transações (usuarioId, tipo, valor, categoria, descricao, data, metaId)
│   │   └── GoalModel.ts           # Schema de Metas (usuarioId, titulo, valorAlvo, valorAtual, dataLimite)
│   ├── middlewares/
│   │   └── validarEmail.ts        # Middlewares: validarEmail (Regex) e authMiddleware (Validação de JWT)
│   ├── services/
│   │   ├── UserServices.ts        # Regras de negócio de usuários (Bcrypt hash/compare, CRUD)
│   │   ├── TransationsServices.ts # CRUD de transações com sincronização automática nas metas
│   │   ├── GoalModelServices.ts   # CRUD de metas de economia
│   │   └── DashboardServices.ts   # Agregação e cálculos de saldo, receitas, despesas por categoria e progresso
│   ├── controllers/
│   │   ├── UserController.ts      # Controller de Usuários e Login
│   │   ├── TransationsController.ts # Controller de Transações
│   │   ├── GoalModelController.ts # Controller de Metas
│   │   └── DashboardController.ts # Controller do Resumo do Dashboard
│   ├── routes.ts                  # Registro e mapeamento de todas as rotas públicas e privadas
│   └── index.ts                   # Entrypoint da aplicação Express
├── .env                           # Variáveis MONGODB_URI, PORT e JWT_SECRET
├── package.json
└── tsconfig.json
```

---

## 🗄️ Modelos de Dados (Mongoose Schemas)

### 1. `UserModel` (`users`)
*   `nome`: String (Obrigatório)
*   `email`: String (Obrigatório, único)
*   `senha`: String (Obrigatório, armazenado como hash Bcrypt)

### 2. `TransationModel` (`transations`)
*   `usuarioId`: ObjectId -> Ref: `'User'` (Obrigatório)
*   `tipo`: String -> Enum: `['receita', 'despesa']` (Obrigatório)
*   `valor`: Number (Obrigatório)
*   `categoria`: String (Obrigatório)
*   `descricao`: String (Obrigatório)
*   `data`: Date (Obrigatório)
*   `metaId`: ObjectId -> Ref: `'GoalModel'` (Opcional - nulo se não vinculada a uma meta)

### 3. `GoalModelModel` (`goalmodels`)
*   `usuarioId`: ObjectId -> Ref: `'User'` (Obrigatório)
*   `titulo`: String (Obrigatório)
*   `valorAlvo`: Number (Obrigatório)
*   `valorAtual`: Number (Padrão: `0`)
*   `dataLimite`: Date (Opcional)

---

## 🔒 Autenticação e Segurança (JWT & Bcrypt)

1.  **Criptografia de Senha**: No cadastro (`criarUsuario`) e na atualização, a senha é criptografada com `bcrypt.hash(senha, 10)`. No login (`POST /login`), o hash é verificado com `bcrypt.compare`.
2.  **Token JWT**: No login bem-sucedido, é gerado um token assinado contendo `{ id: usuario._id, email: usuario.email }` com expiração de 24 horas (`JWT_SECRET`).
3.  **AuthMiddleware**: Intercepta requisições privadas lendo o cabeçalho `Authorization: Bearer <TOKEN>`, valida com `jwt.verify` e injeta `(request as any).userId` na requisição para que os controllers associem automaticamente os dados ao usuário logado.

---

## ⚙️ Regras de Negócio e Sincronização Inteligente

Em `TransationsServices.ts`, a aplicação possui sincronização em tempo real do saldo das metas (`valorAtual` em `GoalModel`):

*   **Criar Transação com `metaId`**:
    *   Se `tipo === 'despesa'` (aporte para meta), soma o valor na meta (`$inc: { valorAtual: +valor }`).
    *   Se `tipo === 'receita'` (resgate da meta), subtrai o valor na meta (`$inc: { valorAtual: -valor }`).
*   **Deletar Transação com `metaId`**:
    *   Estorna o impacto na meta vinculada invertendo o sinal do valor.
*   **Atualizar Transação com `metaId`**:
    *   Recupera o estado da transação antiga antes da atualização, estorna o impacto antigo na meta anterior e aplica o novo impacto na nova meta.

---

## 🌐 Mapeamento de Endpoints da API

| Método | Endpoint | Proteção JWT | Descrição |
| :--- | :--- | :--- | :--- |
| **POST** | `/user` | Pública | Cadastra um novo usuário no banco |
| **POST** | `/login` | Pública | Autentica o usuário e retorna o Token JWT |
| **GET** | `/user` | `authMiddleware` | Lista todos os usuários |
| **PUT** | `/user/:id` | `authMiddleware` | Atualiza dados de um usuário |
| **DELETE** | `/user/:id` | `authMiddleware` | Remove um usuário |
| **POST** | `/transactions` | `authMiddleware` | Cria uma transação (sincroniza com meta se houver `metaId`) |
| **GET** | `/transactions` | `authMiddleware` | Lista apenas as transações do usuário autenticado |
| **PUT** | `/transactions/:id` | `authMiddleware` | Atualiza transação do usuário autenticado com re-sincronização |
| **DELETE** | `/transactions/:id` | `authMiddleware` | Deleta transação do usuário autenticado com estorno na meta |
| **POST** | `/goals` | `authMiddleware` | Cria uma nova meta de economia |
| **GET** | `/goals` | `authMiddleware` | Lista todas as metas do usuário autenticado |
| **PUT** | `/goals/:id` | `authMiddleware` | Atualiza uma meta do usuário autenticado |
| **DELETE** | `/goals/:id` | `authMiddleware` | Remove uma meta do usuário autenticado |
| **GET** | `/dashboards` | `authMiddleware` | Retorna o resumo consolidado do dashboard em um único JSON |

### Estrutura do JSON do `/dashboards` (Resumo)
```json
{
  "saldo": 1500.50,
  "totalReceitas": 4000.00,
  "totalDespesas": 2499.50,
  "despesasPorCategoria": {
    "alimentacao": 500.00,
    "transporte": 150.00,
    "viagem": 1849.50
  },
  "metas": [
    {
      "id": "6a5a022008a481619fc2898e",
      "titulo": "férias",
      "valorAlvo": 700.00,
      "valorAtual": 27.50,
      "dataLimite": "2026-12-30T00:00:00.000Z",
      "progressoPorcentagem": 3.93
    }
  ]
}
```

---

## 🤖 Prompt de Contexto para Utilizar em Outra IA

> "Estou desenvolvendo um sistema de **Gerenciador Financeiro Pessoal & Planejador de Metas**. O meu Backend está 100% concluído em Node.js com TypeScript, Express, Mongoose (MongoDB) e autenticação JWT na porta 5000. O backend já possui suporte a cadastro/login com senhas criptografadas por Bcrypt, CRUD de transações sincronizadas dinamicamente com metas de economia, CRUD de metas e um endpoint consolidado `GET /dashboards` que retorna o saldo total, receitas, despesas, despesas agrupadas por categoria e porcentagem de progresso de cada meta. Todas as rotas privadas utilizam o middleware `authMiddleware` que lê o token `Bearer <token>` e injeta o `userId` na requisição. Agora estou pronto para iniciar o desenvolvimento do **Frontend em Angular** conectando a essa API."
