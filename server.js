const express = require('express');
const sequelize = require('./database');
require('./Registration'); // Carrega modelos e associações
const eventRoutes = require('./eventRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar requisições com corpo em JSON
app.use(express.json());

// Rota de apresentação / verificação da API
app.get('/', (req, res) => {
  res.json({
    message: 'API RESTful para Sistema de Gestão de Eventos (Event Manager)',
    status: 'online'
  });
});

// Registra as rotas de eventos isoladas no Router
app.use(eventRoutes);

// Passo 3, item 6: Sincronização dos modelos com o banco utilizando sequelize.sync()
let server;
const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Banco de dados SQLite sincronizado com sucesso.');
    server = app.listen(PORT, () => {
      console.log(`Servidor rodando com sucesso na porta ${PORT}`);
      console.log(`Rotas disponíveis:`);
      console.log(`- POST http://localhost:${PORT}/events`);
      console.log(`- GET  http://localhost:${PORT}/events`);
      console.log(`- POST http://localhost:${PORT}/events/:id/register`);
    });
    return server;
  } catch (err) {
    console.error('Erro ao sincronizar com o banco de dados:', err);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
