import { AxiosInstance, Method } from 'axios'
import { Storage } from '.'

export interface Request{
  url: string
  data?: any
  params?: any
  method?: Method
}

abstract class BaseClient {
  constructor (
    protected readonly axios: AxiosInstance,
    private readonly storage: Storage) { }

  protected async request<T>(request: Request): Promise<T> {
    const { url, data, params, method } = request
    const headers: any = {}
    const token = this.storage.get('token')
    if (token != null) {
      headers.Authorization = `Bearer ${token}`
    }
    const response = await this.axios.request<T>({ url, data, params, headers, method: method ?? 'GET' })
    return response.data
  }
}

export default BaseClient
