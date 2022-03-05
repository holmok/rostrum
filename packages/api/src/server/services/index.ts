import { IConfig } from 'config'
import { Logger } from 'pino'
import Data from '../data'

import SystemService from './system-service'

export interface ServiceList {
  system: () => SystemService
}

export default function Services (config: IConfig, logger: Logger): ServiceList {
  const data = Data(config, logger)
  const system = new SystemService(data.system(), config, logger)
  return {
    system () {
      return system
    }
  }
}
