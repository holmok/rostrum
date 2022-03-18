import Joi from 'joi'
import { Middleware, Next } from 'koa'
import { ServerContextState, ServerContext } from '../index'

export default function ErrorHandler (validation: {
  query?: Joi.Schema
  params?: Joi.Schema
  body?: Joi.Schema
}
): Middleware<ServerContextState, ServerContext> {
  return async (ctx: ServerContext, next: Next) => {
    try {
      let { query, params, body } = validation
      query = query ?? Joi.object({})
      const q = query.validate(ctx.request.query)
      if (q.error != null) { throw new Error(q.error.message) }

      params = params ?? Joi.object({})
      const p = params.validate(ctx.params)
      if (p.error != null) { throw new Error(p.error.message) }

      body = body ?? Joi.object({})
      const b = body.validate(ctx.request.body)
      if (b.error != null) { throw new Error(b.error.message) }

      ctx.state.validated = { query: q.value, params: p.value, body: b.value }
    } catch (error: any) {
      ctx.log.error(error)
      ctx.throw(400, `Bad request: ${error.message as string}`)
    }
    await next()
  }
}
