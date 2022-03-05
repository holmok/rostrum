import Knex from 'knex'
import { IConfig } from 'config'
import { Logger } from 'pino'

import SystemData from './system-data'

export interface DataList {
  system: () => SystemData
}

export default function Data (config: IConfig, logger: Logger): DataList {
  const knex = Knex(config.get('knex'))
  const system = new SystemData(knex, logger)
  return {
    system () { return system }
  }
}
