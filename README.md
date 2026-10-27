# API RESTful para um Sistema de Gestão de Eventos (Event Manager)

> **Instituição:** Centro Universitário Católica de Quixadá (Unicatólica)  
> **Atividade:** Ponto Extra na composição da nota da AP1  
> **Tecnologias:** Node.js, Express, Sequelize, SQLite3 e Joi  

---

## 📌 Sobre o Projeto

Este projeto consiste em uma API RESTful para controle e gestão de eventos e inscrições. Desenvolvido com **Node.js** e **Express**, utilizando validações robustas de esquema com **Joi** e persistência de dados em banco relacional **SQLite** gerenciado pelo ORM **Sequelize**.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web minimalista e flexível
- **Sequelize**: ORM para modelagem e manipulação do banco de dados relacional
- **SQLite3**: Banco de dados relacional local, leve e embutido
- **Joi**: Biblioteca para validação de esquemas de dados de entrada

---

## 📁 Estrutura de Arquivos

```text
AtividadePontoExtraWagner/
├── database.js               # Conexão e configuração do Sequelize com SQLite
├── Event.js                  # Modelo de Evento (title, date, capacity)
├── Registration.js           # Modelo de Inscrição e relacionamentos 1:N
├── eventRoutes.js            # Router com rotas POST /events, GET /events, POST /events/:id/register
├── validation.js             # Middlewares de validação com esquemas Joi
├── server.js                 # Inicialização do Express, sincronização do Sequelize e escuta na porta
├── test.js                   # Script automatizado de testes dos 5 cenários da atividade
├── requests.http             # Arquivo pronto para execução com Thunder Client / REST Client
├── postman_collection.json   # Coleção exportada para importação no Postman / Insomnia
├── package.json              # Dependências e scripts do projeto
├── .gitignore                # Arquivos ignorados pelo Git (node_modules, sqlite)
└── README.md                 # Documentação completa e checklist
```

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- Node.js instalado (v18 ou superior recomendado)
- Git instalado

### 2. Instalação das dependências
```bash
npm install
```

### 3. Iniciar o servidor
```bash
npm start
```
O servidor iniciará por padrão em `http://localhost:3000`.

---

## 🧪 Como Executar os Testes Automatizados

Para validar automaticamente todos os 5 cenários pedidos no Passo 5 da atividade, execute:
```bash
npm test
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
- **Descrição:** Retorna a lista de eventos com suas respectivas inscrições e a propriedade `registrationsCount` indicando o número atual de inscritos.
- **Resposta Exemplo:**
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
    "participantName": "Maria Silva",
    "email": "maria.silva@example.com"
  }
  ```

---

## ✅ Checklist de Entrega

- [x] **O servidor Node.js com Express está rodando sem erros (ex: na porta 3000).**
- [x] **As rotas de criação (`POST /events`) e listagem (`GET /events`) foram implementadas e isoladas no Router.**
- [x] **A rota de inscrição (`POST /events/:id/register`) foi criada com sucesso.**
- [x] **A validação de dados com Joi está funcionando e barrando requisições incorretas (status 400).**
- [x] **O Sequelize foi configurado corretamente em conjunto com o SQLite.**
- [x] **Os Modelos 'Event' e 'Registration' foram criados e o relacionamento (1:N) foi estabelecido.**
- [x] **A regra de negócio de lotação máxima (capacity) está funcionando (barrando inscrições extras com status 403).**
- [x] **Todos os testes no cliente HTTP (Thunder Client, Insomnia ou Postman) foram aprovados.**
- [x] **O código fonte está devidamente organizado e pronto para commit no repositório do GitHub.**
