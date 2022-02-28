import { SimpleRequest, SimpleResponse } from '../types'
import BaseClient from './base-client'

export default class SystemClient extends BaseClient {
  get names (): {[key: string]: string} {
    return {
      echo: 'simple.echo'
    }
  }

  async echo (request: SimpleRequest): Promise<SimpleRequest> {
    return await this.request<SimpleResponse>({
      url: '/echo',
      params: { message: encodeURIComponent(request.message) }
    })
  }
}
