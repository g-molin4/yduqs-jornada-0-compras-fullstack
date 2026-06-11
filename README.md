# Faculdade Estácio - Jornada de Matrícula Fullstack

Aplicação fullstack para exibição de ofertas de cursos e realização de matrícula, construída como teste técnico com foco em arquitetura, validações, UX, documentação e testes automatizados.

## Visão geral

O projeto reproduz uma jornada de compra/matrícula da Estácio com:

- listagem de cursos vinda do backend
- abertura de sidebar com detalhes do curso
- seleção de parcela quando o curso possui preços
- fluxo de matrícula com validações no frontend e no backend
- tela de sucesso ao concluir a matrícula
- tratamento de erros com feedback visual
- layout responsivo para desktop e mobile

## Stack utilizada

### Frontend

- React 19
- TypeScript
- Vite
- Context API
- shadcn/ui
- Radix UI
- Vitest
- React Testing Library
- Playwright

### Backend

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Swagger
- Jest
- Supertest

### Infra local

- Docker Compose para o PostgreSQL
- `concurrently` para subir frontend e backend juntos

## Funcionalidades implementadas

- carregamento de cursos via `GET /api/course`
- suporte a cursos com e sem parcelas
- sidebar lateral com overlay escurecido
- bloqueio do botão de avanço até selecionar parcela, quando necessário
- formulário de matrícula com máscaras
- validações de:
  - nome completo
  - CPF
  - data de nascimento
  - telefone
  - ano de conclusão
  - aceite dos termos obrigatórios
- envio da matrícula via `POST /api/student/enroll`
- mensagens de erro inline e toast
- proteção de rotas:
  - acesso direto a `/enrollment` sem contexto redireciona para `/`
  - acesso direto a `/success` sem contexto redireciona para `/`
- header e footer reutilizáveis
- favicon e título da aba personalizados

## Estrutura do projeto

```text
.
├── backend
│   ├── prisma
│   ├── src
│   │   ├── common
│   │   ├── course
│   │   ├── infra
│   │   └── student
│   └── test
├── frontend
│   ├── public
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── contexts
│   │   ├── pages
│   │   ├── schemas
│   │   ├── services
│   │   ├── tests
│   │   └── types
│   └── tests
└── docker-compose.yaml
```

## Arquitetura

### Frontend

- `app/`: composição da aplicação e rotas
- `components/`: componentes reutilizáveis e UI base
- `contexts/`: estado compartilhado da jornada de matrícula
- `pages/`: telas principais da aplicação
- `services/`: consumo da API
- `schemas/`: validações da matrícula
- `tests/`: setup e testes automatizados

### Backend

- `course/`: controller, service e repository de cursos
- `student/`: controller, service, mapper e repository de estudantes/matrículas
- `common/`: validações reutilizáveis
- `infra/prisma/`: integração com o banco
- `prisma/`: schema, migrations e seed

## Entidades principais

### Course

- `id`
- `name`
- `modality`
- `campus`
- `address`
- `status`

### CoursePrices

- `id`
- `courseId`
- `name`
- `installments`
- `price`
- `totalPrice`
- `discount`

### Student

- `id`
- `name`
- `email`
- `cpf`
- `phone`
- `birthDate`
- `graduationYear`

### Enrollment

- `id`
- `studentId`
- `courseId`
- `priceId` opcional
- `status`
- `enrollmentDate`

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose

## Configuração do ambiente

### 1. Suba o banco de dados

Na raiz do projeto:

```bash
docker compose up -d
```

O PostgreSQL será exposto em:

- host: `localhost`
- porta: `5433`
- database: `yduqs_db`
- user: `postgres`
- password: `yduqsdatabase`

### 2. Instale as dependências

No backend:

```bash
cd backend
npm install
```

No frontend:

```bash
cd frontend
npm install
```

Observação:

- a raiz do projeto não precisa de `npm install`
- o comando `npm run dev` da raiz usa o `concurrently` instalado no `frontend`

### 3. Configure a variável de ambiente do backend

Crie um arquivo `.env` dentro de `backend/` com:

```env
DATABASE_URL="postgresql://postgres:yduqsdatabase@localhost:5433/yduqs_db?schema=public"
```

### 4. Gere o client do Prisma e aplique as migrations

No diretório `backend`:

```bash
npx prisma generate
npx prisma migrate deploy
```

Se preferir ambiente de desenvolvimento local com criação de migration quando necessário:

```bash
npx prisma migrate dev
```

### 5. Popule o banco com dados iniciais

No diretório `backend`:

```bash
npm run seed
```

O seed cria:

- 1 curso presencial com múltiplas parcelas
- 1 curso EAD sem parcelas

## Como executar

### Subir frontend e backend juntos

Na raiz do projeto:

```bash
npm run dev
```

Esse comando orquestra:

- `backend`: `npm run start:dev --prefix backend`
- `frontend`: `npm run dev --prefix frontend`

### Subir separadamente

Backend:

```bash
cd backend
npm run start:dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## URLs locais

### Frontend

- `http://localhost:5173`

### Backend

- API base: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`

## Endpoints principais

### `GET /api/course`

Retorna a lista de cursos com modalidade, campus, endereço e parcelas.

Exemplo resumido:

```json
[
  {
    "id": "course-presencial-manha",
    "name": "Presencial - Manha",
    "modality": "PRESENCIAL",
    "campus": "CAMPINAS - VILA INDUSTRIAL",
    "address": "RUA DR. SALES DE OLIVEIRA...",
    "prices": [
      {
        "id": "course-price-18x",
        "name": "18x sem juros",
        "installments": 18,
        "price": "169.95",
        "totalPrice": "3059.10",
        "discount": "1692.90"
      }
    ]
  }
]
```

### `POST /api/student/enroll`

Cria uma matrícula.

Exemplo de payload:

```json
{
  "name": "Gabriel Silva",
  "email": "gabriel@email.com",
  "phone": "(19) 99999-9999",
  "cpf": "12345678900",
  "birthDate": "2000-05-20T00:00:00.000Z",
  "graduationYear": "2024",
  "courseId": "course-presencial-manha",
  "priceId": "course-price-18x"
}
```

Observação:

- `priceId` é opcional para cursos sem parcelas

## Validações implementadas

### Frontend e backend

- nome precisa ser completo
- CPF precisa ser válido
- data de nascimento precisa ser válida e não pode ser futura
- telefone precisa ser válido
- ano de conclusão não pode ser maior que o ano atual
- estudante duplicado no mesmo curso é rejeitado

### Regras de jornada

- curso com parcelas exige escolha de parcela
- curso sem parcelas não exige `priceId`
- formulário só habilita o avanço quando os campos obrigatórios estão preenchidos

## Testes

## Backend

No diretório `backend`:

```bash
npm test
npm run test:e2e
npm run test:cov
```

Cobertura atual do backend:

- `46` testes
- cobertura geral em torno de `90%+`

## Frontend

No diretório `frontend`:

```bash
npm run test:run
npm run test:cov
npm run test:e2e
```

Cobertura atual do frontend:

- testes unitários com Vitest e Testing Library
- testes E2E com Playwright
- cobertura geral em torno de `92%` nos testes unitários

### Cenários E2E implementados

- fluxo completo de curso com preço
- fluxo de curso sem preço
- erro de matrícula com mensagem inline e toast

## Experiência do usuário

- loading durante busca de cursos
- mensagens de erro ao carregar dados
- feedback inline no formulário
- toast para erros assíncronos
- sidebar animada
- layout responsivo para desktop e mobile

## Observações importantes

- o frontend usa `VITE_API_BASE_URL` opcionalmente; sem configuração, o padrão é:

```env
http://localhost:3000/api
```

- o backend está com CORS liberado para:

```text
http://localhost:5173
```

- se o frontend rodar em outra porta, o CORS precisa ser ajustado no backend

## Comandos úteis

### Raiz

```bash
npm run dev
```

### Backend

```bash
npm run start:dev
npm run seed
npx prisma generate
npx prisma migrate deploy
```

### Frontend

```bash
npm run dev
npm run build
npm run test:run
npm run test:cov
npm run test:e2e
```

## Status da entrega

O projeto contempla os principais requisitos do teste técnico:

- arquitetura em camadas no backend
- documentação da API
- responsividade e fidelidade visual no frontend
- validações nas duas camadas
- testes unitários, integração e E2E
- banco com Prisma e seed
- documentação de setup
