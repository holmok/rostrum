import Koa from 'koa'
import Config from 'config'
import Pino from 'pino'

export interface ServerOptions {
  host: string
  port: number
}

export type ServerContextState = Koa.DefaultState & {
  config: Config.IConfig
  logger: Pino.Logger
  name: string
  environment: string
  dev: boolean
  host: string
}

export type ServerContext = Koa.ParameterizedContext<ServerContextState>
