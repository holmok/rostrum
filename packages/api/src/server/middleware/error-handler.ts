import { Middleware, Next } from 'koa'
import { ServerContextState, ServerContext } from '../index'

export default function ErrorHandler (): Middleware<ServerContextState, ServerContext> {
  return async (ctx: ServerContext, next: Next) => {
    try {
      await next()
    } catch (error: any) {
      const parts = /^([1-5][0-9]{2}):(.*)$/g.exec(error.message) ?? []
      const code = parts[1] != null ? parseInt(parts[1], 10) : 500
      const msg = parts[2] ?? 'Internal Server Error'
      if (code >= 500) {
        ctx.log.error(error)
      }
      ctx.throw(code, msg)
    }
    if (ctx.status === 404) ctx.throw(404, 'Not Found')
  }
}
