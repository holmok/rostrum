import Axios from 'axios'
import SystemClient from './system-client'

export * from './system-client'

export interface Clients {
  system: () => SystemClient
}

export function InitClients (baseURL: string, timeout: number = 5000): Clients {
  const axios = Axios.create({
    baseURL,
    timeout
  })
  return {
    system: () => new SystemClient(axios)
  }
}
