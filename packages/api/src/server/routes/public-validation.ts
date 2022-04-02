import Joi from 'joi'

export const getEcho = Joi.object({
  message: Joi.string().required()
})
