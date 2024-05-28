import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

// GET, POST, PUT, PATCH, DELETE

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('Server running - HTTP from node behind the scene'))
  .catch((error) => {
    console.log(error)
  })
