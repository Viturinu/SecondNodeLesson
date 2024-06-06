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
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'), // render já envia NODE_ENV como development, pelo que entendi, em ambiente de produção. Logo, trataremos a variavel enviada pelo RENDER lá na nuvem
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sql', 'pg']),
  PORT: z.coerce.number().default(3333), // render já envia PORT como development, pelo que entendi, em ambiente de produção, mas envia uma string por default, por isso usamos o coerce, pra coagir a transformação dessa String em Number. A porta erscolhida também é feita pela nuvem (provider), logo, trataremos a variavel enviada pelo RENDER lá na nuvem || Não importa o valor recebido da nuvem no PORT, transforme isso em Number; caso isso não consigo ser transformado, coloque como default 3333, pois é um number escolhido por nós(vai dar problema na nuvem, pois essa porta póde estar sendo utilizada por outro projeto ou não ter permissão pra usa-la (caso disponivel))
})

export const _env = envSchema.safeParse(process.env) // O parse meio que faz uma confirmação da tipagem acima definida no zod (se der erro, lança uma excessão) ; já o safeParse não dispara um erro quando a verificação falha, ele retorna um objeto com informações sobre a conversão (incluindo o status da conversão com a variável success e data com os dados da conversão)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format()) // mostra o erro formatado para melhor compreensão
  throw new Error('Invalid environment variables')
}

export const env = _env.data
