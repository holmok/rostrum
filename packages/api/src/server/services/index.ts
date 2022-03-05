import { IConfig } from 'config'
import { Logger } from 'pino'
import Data from '../data'
import UserService from './user-service'

import SystemService from './system-service'

export interface ServiceList {
  system: () => SystemService
  users: () => UserService
}

export default function Services (config: IConfig, logger: Logger): ServiceList {
  logger.debug('Services initialized.')
  const data = Data(config, logger)
  const users = new UserService(data.users(), config, logger)
  const system = new SystemService(data.system(), config, logger)
  return {
    system () { return system },
    users () { return users }
  }
}
