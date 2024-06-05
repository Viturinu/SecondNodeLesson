import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

// TESTES
// Unitarios: unidade da sua aplicação
// Integração: comunicação entre duas ou mais unidades
// e2e: ponta a ponta: simulam um usuário operando na nossa aplicação

// front-end: abre a pagina de login,digita otexto victor@gmail.coim no campo ID email, clique no botão
// back-end: chamadas HTTP, WebSocket

// GET, POST, PUT, PATCH, DELETE

app.addHook('preHandler', async (request) => {
  // forma global de anexar um middleware
  console.log(`[${request.method}] ${request.url}`)
}) // passar um hook/middleware/plugin global, para todas as rotas nessa rota

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
