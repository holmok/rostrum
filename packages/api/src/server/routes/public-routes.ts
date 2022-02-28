
import KoaRouter from '@koa/router'
import { ServerContext } from '../../types'

const publicRouter = new KoaRouter()

export default publicRouter
  .get('/ok', getOk)
  .get('/ready', getReady)

async function getOk (ctx: ServerContext): Promise<void> {
  ctx.body = { msg: 'ok' }
}

async function getReady (ctx: ServerContext): Promise<void> {
  ctx.body = { msg: 'ready' }
}
