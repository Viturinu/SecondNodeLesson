import {expect, it, beforeAll, beforeEach, afterAll, describe} from "vitest" //test pode ser 'it, mesma coisa!
import request from "supertest" //quando tempos algo com export defaul podemos importar com qualquer nome (novidade - não sabia) // seria praticamente uma biblioteca que nos permite fazer chamadas em um servidor que não está no ar escutando nenhuma porta (Excelente!)
import { app } from "../src/app"
import { execSync } from "node:child_process" //consigo executar comandos no terminal por dentro da aplicação node

//afterAll - //depois de todos os testes ela será executada - mas será executada apenas uma vez
//afterEach- executa depois de cada teste
//beforeEach() - executa antes de cada teste
describe("transactions routes", ()=> { //criando categorias de testes (transactions routes, other routes)
    beforeAll(async () => { //antes de todos os testes ela será executada - mas será executada apenas uma vez
        await app.ready() //quando terminar de cadastrar os plugins
    })
    
    afterAll(async() => {
        await app.close() //fechar aplicação - limpar da memória
    })

    beforeEach(() => {
        execSync("npm run knex migrate:rollback --all") //pra zerar nosso banco de dados
        execSync("npm run knex migrate:latest") //agora ele é criado novamente
    })

    it("shoud be able to create a new transactions", async ()=>{ //test (import lá em cima, no lugar do it, se quiser) or it
        //fazer a chamada HTTP p/criar uma nova transação
        const response = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
    
        }).expect(201) //app.server é a mesma coisa que o CreateServer do http:node que tinhamos no projeto anterior; Por debaixo dos panos de todo framework, teremos este esquema de abertura de servidor.
    
        expect(response.status).toEqual(201)
    })

    it("shoud be able to list all transactions", async ()=>{ //test (import lá em cima, no lugar do it, se quiser) or it
        //fazer a chamada HTTP p/criar uma nova transação
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
    
        }) //app.server é a mesma coisa que o CreateServer do http:node que tinhamos no projeto anterior; Por debaixo dos panos de todo framework, teremos este esquema de abertura de servidor.
    
        const cookies = createTransactionResponse.get("Set-Cookie") //resgatando o cookie criado na criação do recurso no BD

        const listTransactionsResponse = await request(app.server)
        .get("/transactions")
        .set("Cookie", cookies) //metodo set serve para setarmos os cookies na requisição
        .expect(200)
        
        expect(listTransactionsResponse.body).toEqual([
            expect.objectContaining({
                title:"New transaction",
                amount: 5000,
            }) ,
        ])
    })
    
    it("shoud be able to get a specific transaction", async ()=>{ //test (import lá em cima, no lugar do it, se quiser) or it
        //fazer a chamada HTTP p/criar uma nova transação
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
    
        }) //app.server é a mesma coisa que o CreateServer do http:node que tinhamos no projeto anterior; Por debaixo dos panos de todo framework, teremos este esquema de abertura de servidor.
    
        const cookies = createTransactionResponse.get("Set-Cookie") //resgatando o cookie criado na criação do recurso no BD

        const listTransactionsResponse = await request(app.server)
        .get("/transactions")
        .set("Cookie", cookies) //metodo set serve para setarmos os cookies na requisição
        .expect(200)

        const transactionId = listTransactionsResponse.body[0].id

        const getTransactionsResponse = await request(app.server)
        .get(`/transactions/${transactionId}`)
        .set("Cookie", cookies) //metodo set serve para setarmos os cookies na requisição
        .expect(200)
        
        expect(getTransactionsResponse.body).toEqual(
            expect.objectContaining({
                title:"New transaction",
                amount: 5000,
            })
        )
    }) 

    it("shoud be able to get the summary", async ()=>{ //test (import lá em cima, no lugar do it, se quiser) or it
        //fazer a chamada HTTP p/criar uma nova transação
        const createTransactionResponse = await request(app.server)
        .post('/transactions')
        .send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
    
        }) //app.server é a mesma coisa que o CreateServer do http:node que tinhamos no projeto anterior; Por debaixo dos panos de todo framework, teremos este esquema de abertura de servidor.
    
        const cookies = createTransactionResponse.get("Set-Cookie") //resgatando o cookie criado na criação do recurso no BD

        await request(app.server)
        .post('/transactions')
        .set("Cookie", cookies)
        .send({
            title: 'Debit transaction',
            amount: 2000,
            type: 'debit'
    
        })
        
        const summaryResponse = await request(app.server)
        .get("/transactions/summary")
        .set("Cookie", cookies) //metodo set serve para setarmos os cookies na requisição
        .expect(200)
        
        expect(summaryResponse.body.summary).toEqual(
            expect.objectContaining({
                amount: 3000,
            }) ,
        )
    })
    
    /*
    test("O usuário consegue criar uma nova transação", async ()=>{
        //fazer a chamada HTTP p/criar uma nova transação
        await request(app.server).post("transactions").send({
            title: "New transaction",
            amount: 5000,
            type: "credit"
    
        }).expect(201) //app.server é a mesma coisa que o CreateServer do http:node que tinhamos no projeto anterior; Por debaixo dos panos de todo framework, teremos este esquema de abertura de servidor.
    })
    */
})

