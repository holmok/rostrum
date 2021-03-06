import Config from 'config'
import Pino from 'pino'
import Koa from 'koa'
import Http from 'http'
import Cors from '@koa/cors'
import Routes from './routes'
import Services, { ServiceList } from './services'
import { ServerOptions } from '../config/default'
import KoaLogger from 'koa-pino-logger'
import KoaBodyParser from 'koa-bodyparser'
import { ErrorHandler, AuthHandlers } from './middleware'
import { User } from '@ninebyme/common'

export type ServerContextState = Koa.DefaultState & {
  config: Config.IConfig
  logger: Pino.Logger
  name: string
  environment: string
  dev: boolean
  host: string
  services: ServiceList
  user?: User
}

export type ServerContext = Koa.ParameterizedContext<ServerContextState>

export async function start (): Promise<void> {
  const logger = Pino(Config.get('pino'))
  const server: Server = new Server(Config, logger)
  process.once('SIGTERM', () => {
    console.warn('SIGTERM received...')
    stop(server).catch(console.error)
  })
  process.once('SIGINT', () => {
    console.warn('SIGINT received...')
    stop(server).catch(console.error)
  })
  server.start().catch(logger.error)
}

async function stop (server: Server): Promise<void> {
  try {
    await server.stop()
  } catch (error) {
    console.error('failed to stop server')
    throw error
  }
}

class Server {
  private readonly app: Koa<ServerContextState, ServerContext>
  private readonly services: ServiceList
  server: Http.Server | undefined
  stopping: boolean

  constructor (private readonly config: Config.IConfig, private readonly logger: Pino.Logger) {
    this.logger.info('Server created.')
    this.app = new Koa()
    this.stopping = false
    this.server = undefined
    this.services = Services(config, logger)
  }

  async start (): Promise<void> {
    const name: string = this.config.get('name')
    this.logger.info('%s server starting.', name)

    this.app.use(KoaLogger({ logger: this.logger }))

    // Cors
    this.logger.debug('Setting error handler.')
    this.app.use(ErrorHandler())

    const serverOptions: ServerOptions = this.config.get('server')
    const host = `http://${serverOptions.host}:${serverOptions.port.toString()}`

    // set up server context/state for request/response
    this.logger.debug('Setting up server context.')

    this.app.use(async (ctx: ServerContext, next) => {
      ctx.state.config = this.config
      ctx.state.name = this.config.get('name')
      ctx.state.environment = this.config.get('environment')
      ctx.state.host = host
      ctx.state.dev = this.config.get('environment') !== 'production'
      ctx.state.services = this.services
      await next()
    })

    // Authentication
    this.logger.debug('Setting authentication handler.')
    this.app.use(AuthHandlers.authenticate())

    // Cors
    this.logger.debug('Setting up cors.')
    const corsOptions: Cors.Options = this.config.get('cors')
    this.app.use(Cors(corsOptions))
    this.logger.debug(`Cors setup complete (${JSON.stringify(corsOptions, null, 2)}.`)

    // Body Parser
    this.logger.debug('Setting up body parser.')
    this.app.use(KoaBodyParser())

    // Routes
    this.logger.debug('Setting up routes.')
    const routes = Routes()
    routes.forEach(route => { this.app.use(route) })

    // start server
    this.server = this.app.listen(serverOptions.port, serverOptions.host, () => {
      this.logger.info(
          `${name} server running at ${host}`
      )
    })
  }

  // graceful shutdown
  async stop (): Promise<void> {
    this.logger.warn('Server stop called.')
    if (!this.stopping) {
      this.stopping = true
      return await new Promise((resolve, reject) => {
        if (this.server == null) {
          reject(new Error('no server to stop.'))
        } else {
          // first stop the server
          this.logger.warn('Stopping server...')
          this.server.close((err) => {
            if (err != null) {
              reject(err)
            } else {
              this.logger.warn('...Server stopped.')
              this.logger.warn('Stopping services...')
              // then stop the services
              this.services.shutdown().then(() => {
                this.logger.warn('...Services stopped.')
                resolve()
              }).catch(reject)
            }
          })
        }
      })
    }
  }
}
