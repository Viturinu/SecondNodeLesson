// import 'dotenv/config'
import { config } from 'dotenv' // aparentemente, se eu não setar isso (como eu fazia anteriormente), ele vai funcionar normalmente colocando o path default como .env e bucascando as variáveis deste arquivo específico
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  // se eu executar um framework de teste como vitest, automaticamente o framework preenche a variável de ambiente com test, por isso cai aqui
  config({ path: '.env.test' }) // lá no env.test, só estou reforçando que NODE_ENV é test, pois isso já écitado ao utilizar um framework de teste, como vitast
} else {
  config(/* { path: '.env' } */) // se não colocar o path, ele pega por default
}
// process.env.DATABASE_URL

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

export const _env = envSchema.safeParse(process.env) // O parse meio que faz uma confirmação da tipagem acima definida no zod (se der erro, lança uma excessão) ; já o safeParse não dispara um erro quando a verificação falha, ele retorna um objeto com informações sobre a conversão (incluindo o status da conversão com a variável success e data com os dados da conversão)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format()) // mostra o erro formatado para melhor compreensão
  throw new Error('Invalid environment variables')
}

export const env = _env.data
