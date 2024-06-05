import crypto from 'node:crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  // plugins precisam ser async (regra), pois precisa aguardar para que todo codigo carregue (regra do fastify)
  // isso é um plugin que será registrado no fastify register ; por isso não vamos importar aqui, até porque não faz sentido, uma vez que a importação teria que ser lá, mas lá que está o objeto principal (fastify app)

  // app.addHook('preHandler', async (request, reply) => {
  // console.log(`[${request.method}] ${request.url}`)
  // }) // passar um hook/middleware/plugin global, para todas as rotas nessa rota

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()
      return transactions
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamSchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = getTransactionParamSchema.parse(request.params)
      const { sessionId } = request.cookies // preciso fazer isso aqui porque vou precisar do session ID pra buscar como parametro na query
      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id, // shortsyntax
        })
        .first()
      return transaction
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const summary = await knex('transactions')
        .sum('amount', { as: 'amount' })
        .where('session_id', sessionId)
        .first()
      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    // aqui não tem prehandled, pois é aqui que criamos o session ID
    // {title, amount, type: credit or debit}
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    ) // No parse ele verifica tudo, se der algum erro ele lança uma excessão ---- não precisamos usar safeParse aqui
    // Em chamadas post, normalmente não retornamos o transactions, mas existem os http codes, que vão dizer o status da operação
    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = crypto.randomUUID() // criando o randomID pra nossa sessão
      reply.cookie('sessionId', sessionId, {
        path: '/',
        // expires: new Date('2024-12-01T08:00:00')
        maxAge: 60 * 60 * 24 * 7, // segundos //uma semana ele vai expirar //alternativa pra forma acima, que é mais chata pora colocar um Date certinho
      })
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })
    return reply.status(201).send() // analogamente no mysql temos que colocar INSERT () FROM RETURNING XXXX (Nem sabia desse returning)
  })
}
