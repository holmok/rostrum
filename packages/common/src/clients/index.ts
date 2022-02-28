import Axios from 'axios'
import SimpleClient from './simple-client'

export * from './simple-client'

export interface Clients {
  simple: () => SimpleClient
}

export function InitClients (baseURL: string, timeout: number = 5000): Clients {
  const axios = Axios.create({
    baseURL,
    timeout
  })
  return {
    simple: () => new SimpleClient(axios)
  }
}
