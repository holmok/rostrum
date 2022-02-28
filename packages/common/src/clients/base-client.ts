import { AxiosInstance, Method } from 'axios'

export interface Request{
  url: string
  data?: any
  params?: any
  method?: Method
}

abstract class BaseClient {
  constructor (protected readonly axios: AxiosInstance) {}
  abstract get names (): {[key: string]: string}
  protected async request<T>(request: Request): Promise<T> {
    const { url, data, params, method } = request
    const response = await this.axios.request<T>({ url, data, params, method: method ?? 'GET' })
    return response.data
  }
}

export default BaseClient
