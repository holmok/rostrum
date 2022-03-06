import { Middleware, Next } from 'koa'
import { ServerContextState, ServerContext } from '../index'

export default function ErrorHandler (): Middleware<ServerContextState, ServerContext> {
  return async (ctx: ServerContext, next: Next) => {
    try {
      await next()
      const status = ctx.status ?? 404
      if (status === 404) {
        ctx.throw(404, 'Not Found')
      }
    } catch (error: any) {
      ctx.log.error(error)
      ctx.status = error.statusCode ?? error.status ?? 500 // default 500 to unhandled server error?
      if (ctx.status === 401) {
        ctx.throw(401, 'Unauthorized')
      } else {
        ctx.throw(ctx.status, error.message)
      }
    }
  }
}
