import KoaRouter from '@koa/router'
import { UserResponse, UserListResponse, UserTokenResponse, UserRegisterRequest, UserUpdateRequest, UserType, Pager } from '@ninebyme/common'
import { ServerContext } from '../index'
import { ValidationHandler, AuthHandlers } from '../middleware'

import * as Valid from './user-validation'

const publicRouter = new KoaRouter()

export default publicRouter
  .get('/users/me', getMe)
  .post('/users', ValidationHandler(Valid.postUser), postUser)
  .put('/users/:id', AuthHandlers.authorize(), ValidationHandler(Valid.putUser), putUser)
  .get('/users/:id', AuthHandlers.authorize(), ValidationHandler(Valid.getUser), getUser)
  .get('/users', AuthHandlers.authorize(), ValidationHandler(Valid.getUsers), getUsers)
  .post('/users/login', ValidationHandler(Valid.postLogin), postUserLogin)

async function getMe (ctx: ServerContext): Promise<void> {
  const user = ctx.state.user
  ctx.body = user
}

async function postUser (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const request: UserRegisterRequest = ctx.state.validated.body
  const user: UserResponse = await service.register(request)
  ctx.body = user
}

async function putUser (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const id = ctx.state.validated.params.id
  if (id !== ctx.state.user?.id && ctx.state.user?.type !== UserType.ADMIN) throw new Error('403:Forbidden')
  const request: UserUpdateRequest = ctx.state.validated.body
  if (id !== request.id) {
    throw new Error('400:User id param does not match request body id')
  }
  const user = await service.update(request)
  if (user == null) throw new Error('404:User not found')
  const response: UserTokenResponse = { token: service.tokenize(user) as string }
  ctx.body = response
}

async function getUsers (ctx: ServerContext): Promise<void> {
  const { email, username, offset, limit, sortBy, order } = ctx.state.validated.query
  if (email != null) {
    const service = ctx.state.services.users()
    const user: UserResponse | undefined = await service.getByEmail(email as string)
    if (user == null) throw new Error('404:User not found')
    ctx.body = user
  } else if (username != null) {
    const { username } = ctx.request.query
    const service = ctx.state.services.users()
    const user: UserResponse | undefined = await service.getByUsername(username as string)
    if (user == null) throw new Error('404:User not found')
    ctx.body = user
  } else {
    if (ctx.state.user?.type !== UserType.ADMIN) throw new Error('403:Forbidden')
    const service = ctx.state.services.users()
    const pager: Pager = { offset, limit, sortBy, order: order }
    const users: UserListResponse = await service.list(pager)
    ctx.body = users
  }
}

async function getUser (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const id: number = ctx.state.validated.params.id
  const user: UserResponse | undefined = await service.getById(id)
  if (user == null) throw new Error('404:User not found')
  ctx.body = user
}

async function postUserLogin (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const request: { email: string, password: string } = ctx.state.validated.body
  const user = await service.getByLogin(request.email, request.password)
  if (user == null) throw new Error('400:Invalid log in')
  const response: UserTokenResponse = { token: service.tokenize(user) as string }
  ctx.body = response
}
