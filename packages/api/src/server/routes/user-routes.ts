import KoaRouter from '@koa/router'
import { ORDER, Page, UserStatus, UserType } from '../data/user-data'
import { ServerContext } from '../index'

const publicRouter = new KoaRouter()

export interface RegisterUserRequest {
  email: string
  username: string
  password: string
}

export interface UpdateUserRequest {
  id: number
  email?: string
  username?: string
  password?: string
  created?: Date
  updated?: Date
  lastLogin?: Date
  type?: UserType
  status?: UserStatus
}

export default publicRouter
  .post('/users', postUser)
  .put('/users/:id', putUser)
  .get('/users/:id', getUser)
  .get('/users', getUsers)
  .post('/users/login', postUserLogin)

async function postUser (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const request: RegisterUserRequest = ctx.request.body
  const user = await service.register(request)
  ctx.body = user
}

async function putUser (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const id = parseInt(ctx.params.id)
  const request: UpdateUserRequest = ctx.request.body
  if (id !== request.id) {
    ctx.throw(400, 'id mismatch')
  }
  const user = await service.update(request)
  ctx.body = { token: service.tokenize(user) }
}

async function getUsers (ctx: ServerContext): Promise<void> {
  if (ctx.request.query.email != null) {
    const { email } = ctx.request.query
    const service = ctx.state.services.users()
    const user = await service.getByEmail(email as string)
    ctx.body = user
  } else if (ctx.request.query.username != null) {
    const { username } = ctx.request.query
    const service = ctx.state.services.users()
    const user = await service.getByUsername(username as string)
    ctx.body = user
  } else {
    const { offset, limit, sortBy, order } = ctx.request.query
    const page: Page = {
      offset: parseInt(offset as string ?? '0', 10),
      limit: parseInt(limit as string ?? '10', 10),
      sortBy: sortBy as string ?? 'id',
      order: (order as string ?? 'desc') as ORDER
    }
    const service = ctx.state.services.users()
    const users = await service.list(page)
    ctx.body = users
  }
}

async function getUser (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const user = await service.getById(ctx.params.id)
  ctx.body = user
}

async function postUserLogin (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const request: { email: string, password: string } = ctx.request.body
  const user = await service.getByLogin(request.email, request.password)
  ctx.body = { token: service.tokenize(user) }
}
