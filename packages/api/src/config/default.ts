import Pino from 'pino'

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
