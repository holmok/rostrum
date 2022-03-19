import KoaRouter from '@koa/router'
import Joi from 'joi'
import { SortOrder, Page, UserRegisterRequest, UserUpdateRequest, UserType, UserStatus } from '@ninebyme/common'
import { ServerContext } from '../index'
import ValidationHandler from '../middleware/validation-handler'

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
    password: Joi.string().optional().min(8),
    type: Joi.string().optional().valid(UserType.ADMIN, UserType.EDITOR, UserType.USER),
    status: Joi.string().optional().valid(UserStatus.ACTIVE, UserStatus.DISABLED, UserStatus.DELETED)
  })
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
  .put('/users/:id', ValidationHandler(putUserJoiValid), putUser)
  .get('/users/:id', ValidationHandler(getUserValid), getUser)
  .get('/users', ValidationHandler(getUsersValid), getUsers)
  .post('/users/login', ValidationHandler(postUserLoginValid), postUserLogin)

async function postUser (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const request: UserRegisterRequest = ctx.state.validated.body
  const user = await service.register(request)
  ctx.body = user
}

async function putUser (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const id = ctx.state.validated.params.id
  const request: UserUpdateRequest = ctx.state.validated.body
  if (id !== request.id) {
    ctx.throw(400, 'id mismatch')
  }
  const user = await service.update(request)
  ctx.body = { token: service.tokenize(user) }
}

async function getUsers (ctx: ServerContext): Promise<void> {
  const { email, username, offset, limit, sortBy, order } = ctx.state.validated.query
  if (email != null) {
    const service = ctx.state.services.users()
    const user = await service.getByEmail(email as string)
    if (user == null) ctx.throw(404, 'user not found')
    ctx.body = user
  } else if (username != null) {
    const { username } = ctx.request.query
    const service = ctx.state.services.users()
    const user = await service.getByUsername(username as string)
    if (user == null) ctx.throw(404, 'user not found')
    ctx.body = user
  } else {
    const service = ctx.state.services.users()
    const page: Page = { offset, limit, sortBy, order: order }
    const users = await service.list(page)
    ctx.body = users
  }
}

async function getUser (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const id: number = ctx.state.validated.params.id
  const user = await service.getById(id)
  ctx.body = user
}

async function postUserLogin (ctx: ServerContext): Promise<void> {
  const service = ctx.state.services.users()
  const request: { email: string, password: string } = ctx.state.validated.body
  const user = await service.getByLogin(request.email, request.password)
  ctx.body = { token: service.tokenize(user) }
}
