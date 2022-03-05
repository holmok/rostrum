import Pino from 'pino'
import { Knex } from 'knex'
import PG from 'pg'

export interface ServerOptions {
  host: string
  port: number
}

export const name: string = 'Rostrum'

export const environment = process.env.NODE_ENV ?? 'development'

export const pino: Pino.LoggerOptions = {
  name: `${name}/${environment}`,
  level: process.env.LOG_LEVEL ?? 'debug'
}

export const server: ServerOptions = {
  host: process.env.HOST ?? 'localhost',
  port: parseInt(process.env.PORT ?? '3001', 10)
}

export const knex: Knex.Config = {
  client: 'postgres',
  connection: {
    host: process.env.PG_HOST ?? 'localhost',
    database: process.env.PG_DATABASE ?? 'rostrum',
    password: process.env.PG_PASSWORD ?? 'rostrum',
    user: process.env.PG_USER ?? 'rostrum',
    port: parseInt(process.env.PG_PORT ?? '5432', 10)
  },
  pool: {
    min: 0,
    max: 7,
    afterCreate: function (conn: PG.PoolClient, done: (err: Error | undefined, conn: PG.PoolClient) => void) {
      const schema = process.env.PG_SCHEMA ?? 'rostrum'
      conn.query(
        `SET search_path TO ${schema}, public;`,
        (err: Error | undefined) => {
          done(err, conn)
        })
    }
  }

}
