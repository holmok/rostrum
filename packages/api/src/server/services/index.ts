import { IConfig } from 'config'
import { Logger } from 'pino'

import SystemService from './system-service'

export interface ServiceList {
  system: () => SystemService
}

export default function Services (config: IConfig, logger: Logger): ServiceList {
  const simple = new SystemService(config, logger)
  return {
    system () { return simple }
  }
}
