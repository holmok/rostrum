import KoaRouter from '@koa/router'
import Joi from 'joi'
import { UserResponse, UserListResponse, UserTokenResponse, SortOrder, Page, UserRegisterRequest, UserUpdateRequest, UserType, UserStatus } from '@ninebyme/common'
import { ServerContext } from '../index'
import ValidationHandler from '../middleware/validation-handler'
import AuthHandler from '../middleware/auth-handler'

const publicRouter = new KoaRouter()

const postUserValid = {
  body: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required().min(8)
  })
}

const putUserJoiValid = {
  params: Joi.object({
    id: Joi.number().integer().required()
  }),
  body: Joi.object({
    id: Joi.number().integer().required(),
    email: Joi.string().email().optional(),
    username: Joi.string().optional(),
    newPassword: Joi.string().optional().min(8),
    oldPassword: Joi.string().optional().min(8),
    type: Joi.string().optional().valid(UserType.ADMIN, UserType.EDITOR, UserType.USER),
    status: Joi.string().optional().valid(UserStatus.ACTIVE, UserStatus.DISABLED, UserStatus.DELETED)
  }).with('newPassword', 'oldPassword')
}
const postUserLoginValid = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
  })
}

const getUsersValid = {
  query: Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string().optional(),
    offset: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(1).optional().default(10),
    sortBy: Joi.string().optional().default('id'),
    order: Joi.string().valid(SortOrder.ASC, SortOrder.DESC).optional().default(SortOrder.DESC)
  })
}

const getUserValid = {
  params: Joi.object({
    id: Joi.number().integer().required()
  })
}

export default publicRouter
  .post('/users', ValidationHandler(postUserValid), postUser)
  .put('/users/:id', AuthHandler.authorize(), ValidationHandler(putUserJoiValid), putUser)
  .get('/users/:id', AuthHandler.authorize(), ValidationHandler(getUserValid), getUser)
  .get('/users', AuthHandler.authorize(), ValidationHandler(getUsersValid), getUsers)
  .post('/users/login', ValidationHandler(postUserLoginValid), postUserLogin)

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
    const page: Page = { offset, limit, sortBy, order: order }
    const users: UserListResponse = await service.list(page)
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
