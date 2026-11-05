# API RESTful para um Sistema de Gestão de Eventos (Event Manager) - Partes 1 e 2

> **Instituição:** Centro Universitário Católica de Quixadá (Unicatólica)  
> **Disciplina:** Desenvolvimento Web / Backend  
> **Atividade:** API RESTful para um Sistema de Gestão de Eventos – Parte 1 & Parte 2 (Composição da Nota da AP1)  
> **Tecnologias:** Node.js, Express, Sequelize, SQLite3, Joi, Jest, Supertest, Swagger Autogen, Swagger UI Express  

---

## 📌 Sobre o Projeto

Este projeto consiste em uma API RESTful para controle e gestão de eventos e inscrições desenvolvida em duas etapas:
1. **Parte 1 (Fundação e Regras de Negócio):** Desenvolvimento de endpoints com Express, validações de esquemas de entrada com Joi, persistência de dados relacional com SQLite gerenciado pelo ORM Sequelize e relacionamentos 1:N com regras de capacidade máxima de vagas.
2. **Parte 2 (TDD, Testes de Integração com Mocks e Swagger):** Isolamento de banco de dados com Mocks no Sequelize, testes automatizados seguindo o padrão AAA (Arrange, Act, Assert) com Jest e Supertest, desacoplamento da inicialização do servidor Express para execução limpa de testes, e geração automatizada de documentação interativa com Swagger Autogen acessível via Swagger UI.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor
- **Express**: Framework web para criação das rotas e middlewares
- **Sequelize**: ORM para modelagem, relacionamentos e persistência no banco de dados relacional
- **SQLite3**: Banco de dados relacional embutido
- **Joi**: Validação de esquemas e contratos de entrada
- **Jest**: Framework de testes automatizados e asserções
- **Supertest**: Biblioteca para testes de integração HTTP de endpoints sem necessidade de subir porta física de rede
- **Swagger Autogen & Swagger UI Express**: Geração automática de especificação OpenAPI/Swagger e renderização de painel visual interativo

---

## 📁 Estrutura de Arquivos

```text
AtividadePontoExtraWagner/
├── database.js               # Conexão e configuração do Sequelize com SQLite
├── Event.js                  # Modelo de Evento (title, date, capacity)
├── Registration.js           # Modelo de Inscrição e relacionamentos 1:N
├── eventRoutes.js            # Router de eventos com Comentários Mágicos do Swagger (#swagger.*)
├── validation.js             # Middlewares de validação com esquemas Joi
├── app.js                    # Configuração da aplicação Express, middlewares e Swagger UI (/api-docs)
├── server.js                 # Inicialização do servidor, sincronização do banco e app.listen()
├── swagger.js                # Script de geração automática da documentação Swagger
├── swagger_output.json       # Arquivo de especificação gerado pelo Swagger Autogen
├── eventRoutes.test.js       # Bateria de testes unitários/integração com Jest, Supertest e Mocks (Padrão AAA)
├── test.js                   # Bateria de testes de ponta a ponta com banco real (Parte 1)
├── requests.http             # Arquivo pronto para execução com REST Client / Thunder Client
├── postman_collection.json   # Coleção exportada para importação no Postman / Insomnia
├── package.json              # Dependências e scripts do projeto (npm test, npm run swagger, etc.)
├── .gitignore                # Arquivos ignorados pelo Git (node_modules, sqlite)
└── README.md                 # Documentação completa e checklists
```

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- Node.js instalado (v18 ou superior)
- Git instalado

### 2. Instalação das dependências
```bash
npm install
```

### 3. Geração da documentação Swagger
```bash
npm run swagger
```

### 4. Iniciar o servidor
```bash
npm start
```
O servidor iniciará em `http://localhost:3000`.

---

## 📖 Documentação Interativa com Swagger

Com o servidor em execução, acesse a documentação interativa completa pelo navegador em:
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

A documentação permite inspecionar parâmetros, esquemas de dados de entrada/saída e testar diretamente todos os endpoints da API.

---

## 🧪 Como Executar os Testes Automatizados

### Testes com Jest e Supertest (Parte 2 - Mocks e Padrão AAA)
Executa a suíte de testes unitários isolando completamente o banco de dados via Mocks:
```bash
npm test
```

### Testes de Integração com Banco SQLite Real (Parte 1)
```bash
npm run test:integration
```

---

## 📡 Rotas da API

### 1. Criar Evento
- **Rota:** `POST /events`
- **Validação:** Joi
  - `title`: string obrigatória
  - `date`: data em formato ISO obrigatória
  - `capacity`: número inteiro positivo (maior que zero) obrigatório
- **Body Exemplo:**
  ```json
  {
    "title": "Imersão em Node.js e Express",
    "date": "2026-12-10T19:00:00.000Z",
    "capacity": 2
  }
  ```
- **Respostas:**
  - `201 Created`: Objeto do evento criado.
  - `400 Bad Request`: Se os dados violarem a validação do Joi.

---

### 2. Listar Eventos (com Desafio)
- **Rota:** `GET /events`
- **Descrição:** Retorna a lista de eventos com suas respectivas inscrições e a propriedade calculada `registrationsCount`.
- **Resposta Exemplo (Status 200):**
  ```json
  [
    {
      "id": 1,
      "title": "Imersão em Node.js e Express",
      "date": "2026-12-10T19:00:00.000Z",
      "capacity": 2,
      "registrations": [
        {
          "id": 1,
          "participantName": "Maria Silva",
          "email": "maria.silva@example.com"
        }
      ],
      "registrationsCount": 1
    }
  ]
  ```

---

### 3. Registrar Participante em um Evento
- **Rota:** `POST /events/:id/register`
- **Validação:** Joi
  - `participantName`: string obrigatória
  - `email`: formato de e-mail válido obrigatório
- **Regras de Negócio:**
  1. Busca o evento pelo `id`. Se não existir, retorna `404 Not Found`.
  2. Verifica a quantidade de inscrições já existentes.
  3. Se `registrationsCount >= capacity`, retorna `403 Forbidden` com aviso de que o evento está lotado.
  4. Caso haja vagas, cria a inscrição e retorna `201 Created`.
- **Body Exemplo:**
  ```json
  {
    "participantName": "Carlos Souza",
    "email": "carlos.souza@example.com"
  }
  ```

---

## ✅ Checklist de Entrega - Parte 2

- [x] **O Jest e o Supertest foram instalados e o script npm test executa a suíte sem problemas.**
- [x] **O banco de dados (SQLite/Sequelize) foi isolado nos testes utilizando Mocks.**
- [x] **O padrão AAA (Arrange, Act, Assert) foi aplicado nos testes.**
- [x] **Os testes das rotas GET (status 200) e POST (status 201) de eventos passam com sucesso.**
- [x] **O arquivo `swagger_output.json` é gerado automaticamente pelo Swagger Autogen.**
- [x] **O painel de documentação visual está acessível no navegador através da rota `/api-docs`.**
- [x] **O código fonte está devidamente organizado e foi commitado no repositório do GitHub para o envio.**
