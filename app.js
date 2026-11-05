const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
require('./Registration'); // Carrega modelos e associações
const eventRoutes = require('./eventRoutes');

const app = express();

// Middleware para interpretar requisições com corpo em JSON
app.use(express.json());

// Rota de apresentação / verificação da API
app.get('/', (req, res) => {
  res.json({
    message: 'API RESTful para Sistema de Gestão de Eventos (Event Manager)',
    status: 'online',
    docs: '/api-docs'
  });
});

// Passo 4: Documentação com Swagger na rota /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Registra as rotas de eventos isoladas no Router
app.use(eventRoutes);

module.exports = app;
