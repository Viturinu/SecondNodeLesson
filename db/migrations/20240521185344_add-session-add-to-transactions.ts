import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> { //basicamente o que será criado nessa nova migration (similar ao try)
    await knex.schema.alterTable('transactions', (table) =>{
        table.uuid('session_id').after('id').index
    })
}


export async function down(knex: Knex): Promise<void> { //basicamente o que será desfeito caso ter problema (basicamente o que foi feito acima) (como se fosse o catch)
    await knex.schema.alterTable('transactions', (table)=>{
        table.dropColumn('session_id')
    })
}

