process.env.PORT = '3001';

const { startServer } = require('./server');
const sequelize = require('./database');

async function runTests() {
  console.log('--- Iniciando Bateria de Testes da API de Eventos ---');
  
  // Limpa o banco para garantir ambiente de teste isolado
  await sequelize.sync({ force: true });
  console.log('Banco de dados SQLite inicializado limpo para os testes.\n');

  const server = await startServer();
  const baseUrl = `http://localhost:3001`;

  try {
    // Teste 1: Tente criar um evento sem capacidade definida (deve ser barrado pelo Joi)
    console.log('1. Teste: Criar evento sem capacidade definida (deve retornar 400 pelo Joi)');
    const res1 = await fetch(`${baseUrl}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Workshop de Node.js',
        date: '2026-11-20T14:00:00.000Z'
        // capacity ausente
      })
    });
    const data1 = await res1.json();
    console.log(`Status retornado: ${res1.status} (Esperado: 400)`);
    console.log('Resposta:', data1);
    if (res1.status !== 400) throw new Error('Falha no Teste 1: Esperado status 400');
    console.log('-> Teste 1 APROVADO!\n');

    // Teste 2: Crie um evento válido (ex: capacidade 2)
    console.log('2. Teste: Criar um evento válido com capacidade 2 (deve retornar 201)');
    const res2 = await fetch(`${baseUrl}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Imersão em Node.js e Express',
        date: '2026-12-10T19:00:00.000Z',
        capacity: 2
      })
    });
    const eventCreated = await res2.json();
    console.log(`Status retornado: ${res2.status} (Esperado: 201)`);
    console.log('Evento criado:', eventCreated);
    if (res2.status !== 201 || !eventCreated.id) throw new Error('Falha no Teste 2: Esperado status 201');
    console.log('-> Teste 2 APROVADO!\n');

    const eventId = eventCreated.id;

    // Teste 3: Registre 2 participantes neste evento (as inscrições devem ocorrer com sucesso)
    console.log('3. Teste: Registrar 2 participantes no evento (devem retornar 201)');
    
    // Participante 1
    const res3a = await fetch(`${baseUrl}/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantName: 'Maria Silva',
        email: 'maria.silva@example.com'
      })
    });
    const data3a = await res3a.json();
    console.log(`Participante 1 - Status: ${res3a.status} (Esperado: 201)`);
    console.log('Resposta:', data3a);
    if (res3a.status !== 201) throw new Error('Falha no Teste 3a: Esperado status 201');

    // Participante 2
    const res3b = await fetch(`${baseUrl}/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantName: 'João Santos',
        email: 'joao.santos@example.com'
      })
    });
    const data3b = await res3b.json();
    console.log(`Participante 2 - Status: ${res3b.status} (Esperado: 201)`);
    console.log('Resposta:', data3b);
    if (res3b.status !== 201) throw new Error('Falha no Teste 3b: Esperado status 201');
    console.log('-> Teste 3 APROVADO (2 participantes registrados com sucesso)!\n');

    // Teste 4: Tente registrar um 3º participante (a API deve barrar e informar que está lotado)
    console.log('4. Teste: Registrar 3º participante em evento lotado (deve retornar 403)');
    const res4 = await fetch(`${baseUrl}/events/${eventId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantName: 'Carlos Souza',
        email: 'carlos.souza@example.com'
      })
    });
    const data4 = await res4.json();
    console.log(`Status retornado: ${res4.status} (Esperado: 403)`);
    console.log('Resposta:', data4);
    if (res4.status !== 403) throw new Error('Falha no Teste 4: Esperado status 403');
    console.log('-> Teste 4 APROVADO (Inscrição barrada corretamente por lotação)!\n');

    // Teste 5: Liste os eventos e verifique se as informações estão corretas
    console.log('5. Teste: Listar eventos e verificar informações e contagem de inscrições (GET /events)');
    const res5 = await fetch(`${baseUrl}/events`);
    const eventsList = await res5.json();
    console.log(`Status retornado: ${res5.status} (Esperado: 200)`);
    console.log('Lista de Eventos:', JSON.stringify(eventsList, null, 2));
    if (res5.status !== 200 || !Array.isArray(eventsList)) throw new Error('Falha no Teste 5: Esperado status 200 e array');

    const found = eventsList.find(e => e.id === eventId);
    if (!found || found.registrationsCount !== 2) {
      throw new Error(`Falha no Teste 5: Contagem esperada era 2, recebido: ${found?.registrationsCount}`);
    }
    console.log('-> Teste 5 APROVADO (Evento listado com contagem correta de inscrições)!\n');

    console.log('====================================================');
    console.log('✓ TODOS OS 5 TESTES DO DOCUMENTO PASSARAM COM SUCESSO!');
    console.log('====================================================');

  } catch (err) {
    console.error('Erro nos testes:', err);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
    try {
      await sequelize.close();
    } catch (_) {}
  }
}

runTests();
