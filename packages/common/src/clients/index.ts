import Axios from 'axios'
import SystemClient from './system-client'
import UsersClient from './users-client'

export * from './system-client'
export * from './users-client'

export interface Clients {
  system: () => SystemClient
  users: () => UsersClient
  setToken: (token: string) => void
  removeToken: () => void
}

export interface Storage {
  get: (key: string) => string | null
  set: (key: string, value: string | null) => void
}

class SimpleStorage implements Storage {
  private storage: { [key: string]: string | null } = {}
  get (key: string): string | null {
    return this.storage[key] ?? null
  }

  set (key: string, value: string | null | undefined): void {
    this.storage[key] = value ?? null
  }
}

export function InitClients (
  baseURL: string,
  storage: Storage = new SimpleStorage(),
  timeout: number = 5000): Clients {
  const axios = Axios.create({ baseURL, timeout })
  return {
    system: () => new SystemClient(axios, storage),
    users: () => new UsersClient(axios, storage),
    setToken: (token: string) => storage.set('token', token),
    removeToken: () => storage.set('token', null)
  }
}
