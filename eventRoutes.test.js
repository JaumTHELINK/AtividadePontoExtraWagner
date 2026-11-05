const request = require('supertest');

// Passo 2: Mocks e Isolamento do Banco de Dados (Sequelize)
// Substitui o comportamento do banco e dos modelos para nunca acessar o banco de dados real
jest.mock('./database', () => ({
  sync: jest.fn().mockResolvedValue(),
  define: jest.fn()
}));

jest.mock('./Event', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  hasMany: jest.fn()
}));

jest.mock('./Registration', () => ({
  count: jest.fn(),
  create: jest.fn(),
  belongsTo: jest.fn()
}));

const app = require('./app');
const Event = require('./Event');
const Registration = require('./Registration');

describe('Testes de Rotas da API de Gestão de Eventos (Event Routes)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Passo 3: Teste da Rota GET (Padrão AAA)
  describe('GET /events - Listagem de Eventos', () => {
    it('deve retornar status 200 e a lista de eventos com contagem de inscrições', async () => {
      // Arrange (Preparação)
      const mockEvents = [
        {
          id: 1,
          title: 'Workshop de Node.js',
          date: '2026-11-20T14:00:00.000Z',
          capacity: 30,
          registrations: [
            { id: 1, participantName: 'João Silva', email: 'joao@example.com' }
          ],
          toJSON() {
            return {
              id: this.id,
              title: this.title,
              date: this.date,
              capacity: this.capacity,
              registrations: this.registrations
            };
          }
        }
      ];
      Event.findAll.mockResolvedValue(mockEvents);

      // Act (Ação)
      const response = await request(app).get('/events');

      // Assert (Verificação)
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Workshop de Node.js');
      expect(response.body[0].registrationsCount).toBe(1);
      expect(Event.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // Passo 3: Teste da Rota POST (Sucesso - Padrão AAA)
  describe('POST /events - Criação de Evento', () => {
    it('deve simular a criação de um evento com sucesso e retornar status 201', async () => {
      // Arrange (Preparação)
      const newEventData = {
        title: 'Imersão em Node.js e Express',
        date: '2026-12-10T19:00:00.000Z',
        capacity: 50
      };
      const createdEventMock = {
        id: 1,
        ...newEventData,
        createdAt: '2026-11-05T00:00:00.000Z',
        updatedAt: '2026-11-05T00:00:00.000Z'
      };
      Event.create.mockResolvedValue(createdEventMock);

      // Act (Ação)
      const response = await request(app)
        .post('/events')
        .send(newEventData);

      // Assert (Verificação)
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body.title).toBe(newEventData.title);
      expect(response.body.capacity).toBe(newEventData.capacity);
      expect(Event.create).toHaveBeenCalledWith(newEventData);
    });

    it('deve retornar status 400 quando o payload não atender à validação Joi', async () => {
      // Arrange (Preparação) - Faltando o campo obrigatório 'capacity'
      const invalidEventData = {
        title: 'Evento Sem Capacidade',
        date: '2026-12-10T19:00:00.000Z'
      };

      // Act (Ação)
      const response = await request(app)
        .post('/events')
        .send(invalidEventData);

      // Assert (Verificação)
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(Event.create).not.toHaveBeenCalled();
    });
  });

  // Passo 3: Teste de Regra de Negócio (Lotação Máxima - Padrão AAA)
  describe('POST /events/:id/register - Inscrição em Eventos', () => {
    it('deve barrar a inscrição e retornar status 403 quando o evento atingir a lotação máxima', async () => {
      // Arrange (Preparação)
      const eventId = 1;
      const eventMock = {
        id: eventId,
        title: 'Palestra de Segurança da Informação',
        date: '2026-12-15T18:00:00.000Z',
        capacity: 2
      };
      // Simula busca do evento existente pelo ID
      Event.findByPk.mockResolvedValue(eventMock);
      // Simula que a contagem atual de inscrições atingiu a capacidade máxima (2 de 2)
      Registration.count.mockResolvedValue(2);

      const registrationData = {
        participantName: 'Carlos Souza',
        email: 'carlos.souza@example.com'
      };

      // Act (Ação)
      const response = await request(app)
        .post(`/events/${eventId}/register`)
        .send(registrationData);

      // Assert (Verificação)
      expect(response.statusCode).toBe(403);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/lotado/i);
      expect(Event.findByPk).toHaveBeenCalledWith(String(eventId));
      expect(Registration.count).toHaveBeenCalledWith({ where: { eventId: String(eventId) } });
      // Garante que o registro não foi criado devido à capacidade máxima
      expect(Registration.create).not.toHaveBeenCalled();
    });

    it('deve realizar a inscrição com sucesso e retornar status 201 quando houver vagas disponíveis', async () => {
      // Arrange (Preparação)
      const eventId = 1;
      const eventMock = {
        id: eventId,
        title: 'Palestra de Segurança da Informação',
        date: '2026-12-15T18:00:00.000Z',
        capacity: 10
      };
      const registrationData = {
        participantName: 'Maria Silva',
        email: 'maria.silva@example.com'
      };
      const createdRegistrationMock = {
        id: 1,
        ...registrationData,
        eventId,
        createdAt: '2026-11-05T00:00:00.000Z',
        updatedAt: '2026-11-05T00:00:00.000Z'
      };

      Event.findByPk.mockResolvedValue(eventMock);
      Registration.count.mockResolvedValue(3); // 3 inscritos para 10 vagas
      Registration.create.mockResolvedValue(createdRegistrationMock);

      // Act (Ação)
      const response = await request(app)
        .post(`/events/${eventId}/register`)
        .send(registrationData);

      // Assert (Verificação)
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'Inscrição realizada com sucesso!');
      expect(response.body).toHaveProperty('registration');
      expect(Registration.create).toHaveBeenCalledWith({
        participantName: registrationData.participantName,
        email: registrationData.email,
        eventId: eventMock.id
      });
    });

    it('deve retornar status 404 quando o evento não existir', async () => {
      // Arrange (Preparação)
      const nonExistentId = 999;
      Event.findByPk.mockResolvedValue(null);

      // Act (Ação)
      const response = await request(app)
        .post(`/events/${nonExistentId}/register`)
        .send({
          participantName: 'Participante Fantasma',
          email: 'fantasma@example.com'
        });

      // Assert (Verificação)
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Evento não encontrado');
      expect(Registration.create).not.toHaveBeenCalled();
    });
  });

  // Passo 4: Documentação com Swagger
  describe('Swagger UI - Documentação Interativa', () => {
    it('deve servir a interface visual do Swagger na rota /api-docs', async () => {
      // Act
      const response = await request(app).get('/api-docs/');

      // Assert
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('swagger-ui');
    });
  });
});
