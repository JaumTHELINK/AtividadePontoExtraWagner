const Joi = require('joi');

const eventSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'any.required': 'O campo "title" é obrigatório',
    'string.empty': 'O campo "title" não pode estar vazio'
  }),
  date: Joi.date().iso().required().messages({
    'any.required': 'O campo "date" é obrigatório',
    'date.format': 'O campo "date" deve estar no formato de data ISO válido'
  }),
  capacity: Joi.number().integer().positive().required().messages({
    'any.required': 'O campo "capacity" é obrigatório',
    'number.base': 'O campo "capacity" deve ser um número',
    'number.integer': 'O campo "capacity" deve ser um número inteiro',
    'number.positive': 'O campo "capacity" deve ser maior que zero'
  })
});

const registrationSchema = Joi.object({
  participantName: Joi.string().trim().required().messages({
    'any.required': 'O campo "participantName" é obrigatório',
    'string.empty': 'O campo "participantName" não pode estar vazio'
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'O campo "email" é obrigatório',
    'string.email': 'O campo "email" deve ser um formato de email válido'
  })
});

function validateEvent(req, res, next) {
  const { error } = eventSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: 'Dados de entrada inválidos',
      details: error.details.map(d => d.message)
    });
  }
  next();
}

function validateRegistration(req, res, next) {
  const { error } = registrationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: 'Dados de entrada inválidos',
      details: error.details.map(d => d.message)
    });
  }
  next();
}

module.exports = {
  validateEvent,
  validateRegistration
};
