import { IConfig } from 'config'
import { Logger } from 'pino'
import OS from 'os'
import { EchoRequest, EchoResponse } from '@rostrum/common'

class SystemService {
  private readonly name: string
  private readonly environment: string
  constructor (
    private readonly config: IConfig,
    private readonly logger: Logger
  ) {
    this.logger.debug('Initialize SimpleService')
    this.name = config.get('name')
    this.environment = config.get('environment')
  }

  echo (request: EchoRequest): EchoResponse {
    const response = {
      message: request.message,
      timestamp: new Date(),
      status: 'ok',
      success: true,
      host: OS.hostname(),
      name: this.name,
      environment: this.environment
    }
    return response
  }
}

export default SystemService
