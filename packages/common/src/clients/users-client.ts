import { User } from 'src/types'
import BaseClient from './base-client'

export default class UsersClient extends BaseClient {
  async getMe (): Promise<User> {
    const user = await this.request<User | string>({ url: '/users/me' })
    if (typeof user === 'string' && user.length === 0) {
      return { } as unknown as User
    } else {
      return user as User
    }
  }
}
