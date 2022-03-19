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
      let code = 500
      let msg = 'Internal Server Error'
      if (ctx.status === 401) {
        msg = 'Unauthorized'
        code = 401
      } else {
        const parts = /^([1-5][0-9]{2}):(.*)$/g.exec(error.message) ?? []
        code = parts[1] != null ? parseInt(parts[1], 10) : code
        msg = parts[2] ?? msg
      }
      ctx.throw(code, msg)
    }
  }
}
