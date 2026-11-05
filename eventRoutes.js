const express = require('express');
const router = express.Router();
const Event = require('./Event');
const Registration = require('./Registration');
const { validateEvent, validateRegistration } = require('./validation');

// 1. Rota POST /events: Cria um novo evento com dados validados
router.post('/events', validateEvent, async (req, res) => {
  /*
    #swagger.tags = ['Eventos']
    #swagger.summary = 'Criação de um novo evento'
    #swagger.description = 'Cria um novo evento com dados validados via Joi.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Corpo da requisição com os dados do evento',
      required: true,
      schema: {
        title: 'Imersão em Node.js e Express',
        date: '2026-12-10T19:00:00.000Z',
        capacity: 50
      }
    }
    #swagger.responses[201] = {
      description: 'Evento criado com sucesso',
      schema: {
        id: 1,
        title: 'Imersão em Node.js e Express',
        date: '2026-12-10T19:00:00.000Z',
        capacity: 50,
        createdAt: '2026-11-05T00:00:00.000Z',
        updatedAt: '2026-11-05T00:00:00.000Z'
      }
    }
    #swagger.responses[400] = {
      description: 'Erro de validação nos dados fornecidos'
    }
  */
  try {
    const { title, date, capacity } = req.body;
    const newEvent = await Event.create({ title, date, capacity });
    return res.status(201).json(newEvent);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar evento', details: error.message });
  }
});

// 2. Rota GET /events: Retorna todos os eventos com a contagem de inscrições (Desafio)
router.get('/events', async (req, res) => {
  /*
    #swagger.tags = ['Eventos']
    #swagger.summary = 'Listagem de eventos'
    #swagger.description = 'Retorna todos os eventos cadastrados juntamente com a contagem de inscrições.'
    #swagger.responses[200] = {
      description: 'Lista de eventos retornada com sucesso',
      schema: [{
        id: 1,
        title: 'Imersão em Node.js e Express',
        date: '2026-12-10T19:00:00.000Z',
        capacity: 50,
        registrationsCount: 2,
        registrations: []
      }]
    }
  */
  try {
    const events = await Event.findAll({
      include: [
        {
          model: Registration,
          as: 'registrations',
          attributes: ['id', 'participantName', 'email', 'createdAt']
        }
      ]
    });

    const eventsWithCount = events.map(event => {
      const eventJson = typeof event.toJSON === 'function' ? event.toJSON() : event;
      return {
        ...eventJson,
        registrationsCount: eventJson.registrations ? eventJson.registrations.length : 0
      };
    });

    return res.status(200).json(eventsWithCount);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar eventos', details: error.message });
  }
});

// 3. Rota POST /events/:id/register: Registra um participante no evento
router.post('/events/:id/register', validateRegistration, async (req, res) => {
  /*
    #swagger.tags = ['Eventos']
    #swagger.summary = 'Inscrição de participante em evento'
    #swagger.description = 'Registra um participante no evento informado pelo ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do evento',
      required: true,
      type: 'integer'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do participante a ser inscrito',
      required: true,
      schema: {
        participantName: 'Maria Silva',
        email: 'maria.silva@example.com'
      }
    }
    #swagger.responses[201] = {
      description: 'Inscrição realizada com sucesso'
    }
    #swagger.responses[400] = {
      description: 'Erro de validação nos dados do participante'
    }
    #swagger.responses[403] = {
      description: 'O evento está lotado. Limite máximo de vagas atingido.'
    }
    #swagger.responses[404] = {
      description: 'Evento não encontrado'
    }
  */
  try {
    const { id } = req.params;
    const { participantName, email } = req.body;

    // a. Busque o evento pelo ID informado na URL
    const event = await Event.findByPk(id);

    // b. Se o evento não existir, retorne 404
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // c. Conte quantas inscrições já existem para este evento
    const currentRegistrationsCount = await Registration.count({
      where: { eventId: id }
    });

    // d. Se o número de inscrições for igual ou maior que a capacidade ('capacity'), retorne 403
    if (currentRegistrationsCount >= event.capacity) {
      return res.status(403).json({
        error: 'O evento está lotado. Limite máximo de vagas atingido.'
      });
    }

    // e. Se houver vaga, crie o registro na tabela Registration e retorne status 201
    const newRegistration = await Registration.create({
      participantName,
      email,
      eventId: event.id
    });

    return res.status(201).json({
      message: 'Inscrição realizada com sucesso!',
      registration: newRegistration
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao registrar participante', details: error.message });
  }
});

module.exports = router;
