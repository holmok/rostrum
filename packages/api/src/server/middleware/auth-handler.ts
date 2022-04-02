import { Middleware, Next } from 'koa'
import { ServerContextState, ServerContext } from '../index'
import { AllowedAccess } from '@ninebyme/common'

function AuthenticationHandler (): Middleware<ServerContextState, ServerContext> {
  return async (ctx: ServerContext, next: Next) => {
    const authHeader = ctx.request.header.authorization
    if (authHeader != null) {
      const [_, bearer, token] = /^(Bearer) (.+)$/.exec(authHeader) ?? []
      if (_ != null && bearer != null && token != null) {
        const service = ctx.state.services.users()
        const user = service.validateToken(token)
        if (user != null) {
          ctx.state.user = user
        }
      }
    }
    await next()
  }
}

function AuthorizationHandler (access: AllowedAccess = AllowedAccess.USER): Middleware<ServerContextState, ServerContext> {
  return async (ctx: ServerContext, next: Next) => {
    const user = ctx.state.user
    if (user != null) {
      if (access === AllowedAccess.ADMIN) {
        if (user.type === 'admin') {
          await next()
        } else {
          ctx.throw(403, 'Forbidden')
        }
      } else {
        await next()
      }
    } else {
      throw new Error('401:Unauthorized')
    }
  }
}

export const AuthHandlers = {
  authenticate: AuthenticationHandler,
  authorize: AuthorizationHandler
}
