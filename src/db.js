import {createPool} from 'mysql2/promise'

export const pool = createPool({
    host:'localhost',
    user:'root',
    password:'sxnty',
    port: 3306,
    database: 'medialabs_dev'
})