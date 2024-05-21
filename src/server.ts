import fastify from 'fastify'
import crypto from 'crypto'
import { knex } from './database'

const app = fastify()

// GET, POST, PUT, PATCH, DELETE

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

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('Server running - HTTP from node behind the scene'))
