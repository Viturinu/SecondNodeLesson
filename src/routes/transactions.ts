import crypto from 'crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function transactionsRoutes(app: FastifyInstance) {
  // plugins precisam ser async (regra), pois precisa aguardar para que todo codigo carregue (regra do fastify)
  // isso é um plugin que será registrado no fastify register ; por isso não vamos importar aqui, até porque não faz sentido, uma vez que a importação teria que ser lá, mas lá que está o objeto principal (fastify app)
  app.post('/', async (request, reply) => {
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
    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      type,
    })

    return reply.status(201).send() // analogamente no mysql temos que colocar INSERT () FROM RETURNING XXXX (Nem sabia desse returning)
  })
}
