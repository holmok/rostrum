import Knex from 'knex'
import { IConfig } from 'config'
import { Logger } from 'pino'

import SystemData from './system-data'
import UserData from './user-data'

export interface DataList {
  system: () => SystemData
  users: () => UserData
}

export default function Data (config: IConfig, logger: Logger): DataList {
  logger.debug('Data providers initialized.')
  const knex = Knex<any, Array<Record<string, any>>>(config.get('knex'))
  const system = new SystemData(knex, logger)
  const users = new UserData(knex, logger)
  return {
    system () { return system },
    users () { return users }
  }
}
