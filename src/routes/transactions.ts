import crypto from 'crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'

export async function transactionsRoutes(app: FastifyInstance) {
  // plugins precisam ser async (regra), pois precisa aguardar para que todo codigo carregue (regra do fastify)
  // isso é um plugin que será registrado no fastify register ; por isso não vamos importar aqui, até porque não faz sentido, uma vez que a importação teria que ser lá, mas lá que está o objeto principal (fastify app)
  app.get('/hello', async () => {
    const transactions = await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title: 'Transação de teste',
        amount: 1000,
      })
      .returning('*')
    return transactions // analogamente no mysql temos que colocar INSERT () FROM RETURNING XXXX (Nem sabia desse returning)
  })
}
