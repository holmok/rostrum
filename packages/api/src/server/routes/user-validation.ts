import Joi from 'joi'
import { UserStatus, UserType, SortOrder } from '@ninebyme/common'

export const postUser = {
  body: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required().min(8)
  })
}

export const putUser = {
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

export const postLogin = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
  })
}

export const getUsers = {
  query: Joi.object({
    email: Joi.string().email().optional(),
    username: Joi.string().optional(),
    offset: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(1).optional().default(10),
    sortBy: Joi.string().optional().default('id'),
    order: Joi.string().valid(SortOrder.ASC, SortOrder.DESC).optional().default(SortOrder.DESC)
  })
}

export const getUser = {
  params: Joi.object({
    id: Joi.number().integer().required()
  })
}
