const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API RESTful - Sistema de Gestão de Eventos',
    description: 'Documentação interativa gerada automaticamente com Swagger Autogen para a API de Gestão de Eventos (Unicatólica - Parte 2)',
    version: '2.0.0'
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Eventos',
      description: 'Endpoints para criação, listagem e inscrição em eventos'
    }
  ]
};

const outputFile = './swagger_output.json';
const routes = ['./eventRoutes.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log('Documentação Swagger gerada com sucesso em swagger_output.json!');
});

