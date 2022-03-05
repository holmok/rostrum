import { EchoRequest, OkayResponse, ReadyResponse } from '../types'
import BaseClient from './base-client'

export default class SystemClient extends BaseClient {
  get names (): {[key: string]: string} {
    return {
      echo: 'simple.echo'
    }
  }

  async echo (request: EchoRequest): Promise<ReadyResponse> {
    return await this.request<ReadyResponse>({
      url: '/echo',
      params: {
        message: encodeURIComponent(request.message),
        delay: encodeURIComponent(request.delay ?? 3000)
      }
    })
  }

  async ready (): Promise<ReadyResponse> {
    return await this.request<ReadyResponse>({ url: '/ready' })
  }

  async okay (): Promise<OkayResponse> {
    return await this.request<OkayResponse>({ url: '/ok' })
  }
}
