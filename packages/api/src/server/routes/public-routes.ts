
import KoaRouter from '@koa/router'
import { EchoRequest } from '@rostrum/common'
import { ServerContext } from '../index'

const publicRouter = new KoaRouter()

export default publicRouter
  .get('/ok', getOk)
  .get('/ready', getReady)
  .get('/echo', getEcho)

async function getOk (ctx: ServerContext): Promise<void> {
  ctx.body = { status: 'ok' }
}

async function getReady (ctx: ServerContext): Promise<void> {
  const system = ctx.state.services.system()
  const isReady = await system.ready()
  if (isReady) {
    ctx.body = { status: 'ready' }
  } else {
    ctx.status = 503
    ctx.body = { status: 'not ready' }
  }
}

async function getEcho (ctx: ServerContext): Promise<void> {
  const request: EchoRequest = { message: ctx.request.query.message as string }
  const system = ctx.state.services.system()
  ctx.body = system.echo(request)
}
