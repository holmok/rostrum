import Koa from 'koa'

import PublicRoutes from './public-routes'
import UserRoutes from './user-routes'

import { ServerContextState, ServerContext } from '../index'
const routes = [
  PublicRoutes.routes(),
  PublicRoutes.allowedMethods(),
  UserRoutes.routes(),
  UserRoutes.allowedMethods()
]

export default (): Array<Koa.Middleware<ServerContextState, ServerContext>> => routes as Array<Koa.Middleware<ServerContextState, ServerContext>>
