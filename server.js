const app = require('./app');
const sequelize = require('./database');

const PORT = process.env.PORT || 3000;

let server;

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Banco de dados SQLite sincronizado com sucesso.');
    server = app.listen(PORT, () => {
      console.log(`Servidor rodando com sucesso na porta ${PORT}`);
      console.log(`Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`);
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

// Se executado diretamente pelo terminal (node server.js), inicia o servidor
if (require.main === module) {
  startServer();
}

// Exporta app para testes (Supertest) e startServer para execução programática
module.exports = app;
module.exports.app = app;
module.exports.startServer = startServer;
