import Pino from 'pino'
import { Knex } from 'knex'
import PG from 'pg'
import { knexSnakeCaseMappers } from 'objection'
import Cors from '@koa/cors'

export const pwSalt: string = 'jygxnkxjhooeqbwwsqxcmquyqsahvwou'
export interface ServerOptions {
  host: string
  port: number
}

export const cors: Cors.Options = {
  origin: '*'
}

export const jwtSecret = process.env.JWT_SECRET ?? 'zOpENiUTLm7noaTHWlbDLVkWabkeEWFja2Z3j4lAR22OVbm2NzKRdQmCF0AF'

export const name: string = 'ninebyme'

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
  ...knexSnakeCaseMappers(),
  client: 'postgres',
  connection: {
    host: process.env.PG_HOST ?? 'localhost',
    database: process.env.PG_DATABASE ?? 'ninebyme',
    password: process.env.PG_PASSWORD ?? 'ninebyme',
    user: process.env.PG_USER ?? 'ninebyme',
    port: parseInt(process.env.PG_PORT ?? '5432', 10)
  },
  pool: {
    min: 0,
    max: 7,
    afterCreate: function (conn: PG.PoolClient, done: (err: Error | undefined, conn: PG.PoolClient) => void) {
      const schema = process.env.PG_SCHEMA ?? 'ninebyme'
      conn.query(
        `SET search_path TO ${schema}, public;`,
        (err: Error | undefined) => {
          done(err, conn)
        })
    }
  }

}
