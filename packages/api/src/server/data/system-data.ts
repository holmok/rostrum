import Pino from 'pino'
import { Knex } from 'knex'
class SystemData {
  constructor (private readonly knex: Knex, private readonly logger: Pino.Logger) {
    this.logger.debug('SystemData initialized')
  }

  async ready (): Promise<boolean> {
    this.logger.debug('Checking system data')
    try {
      await this.knex.raw('SELECT NOW();')
      return true
    } catch (error) {
      this.logger.error('Error checking system data', error)
      return false
    }
  }
}

export default SystemData
