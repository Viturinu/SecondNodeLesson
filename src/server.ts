import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

// TESTES
// Unitarios: unidade da sua aplicação
// Integração: comunicação entre duas ou mais unidades
// e2e: ponta a ponta: simulam um usuário operando na nossa aplicação

// front-end: abre a pagina de login,digita otexto victor@gmail.coim no campo ID email, clique no botão
// back-end: chamadas HTTP, WebSocket

// GET, POST, PUT, PATCH, DELETE

app.addHook('preHandler', async (request, reply) => {
  // forma global de anexar um middleware
  console.log(`[${request.method}] ${request.url}`)
}) // passar um hook/middleware/plugin global, para todas as rotas nessa rota

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app.get('/try', async (request, reply) => {
  // apenas pra testar preHandler global
  return reply.status(200).send('Deu certo')
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('Server running - HTTP from node behind the scene'))
  .catch((error) => {
    console.log(error)
  })
