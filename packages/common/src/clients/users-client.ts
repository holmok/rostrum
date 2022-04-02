import { Pager, User, UserListResponse, UserRegisterRequest, UserResponse, UserTokenResponse, UserUpdateRequest } from '../types'
import BaseClient from './base-client'

export default class UsersClient extends BaseClient {
  async me (): Promise<User> {
    const user = await this.request<User | string>({ url: '/users/me' })
    if (typeof user === 'string' && user.length === 0) {
      return { } as unknown as User
    } else {
      return user as User
    }
  }

  async register (user: UserRegisterRequest): Promise<UserResponse> {
    console.log('user', user)
    return await this.request<UserResponse>({ url: '/users', data: user, method: 'POST' })
  }

  async login (email: string, password: string): Promise<UserResponse> {
    return await this.request<UserResponse>({ url: '/users/login', data: { email, password }, method: 'POST' })
  }

  async update (user: UserUpdateRequest): Promise<UserTokenResponse> {
    return await this.request<UserTokenResponse>({ url: '/users/:id', data: user, method: 'PUT' })
  }

  async get (id: number): Promise<User> {
    return await this.request<User>({ url: `/users/${id}` })
  }

  async list (pager?: Pager): Promise<UserListResponse> {
    return await this.request<UserListResponse>({ url: '/users', params: pager })
  }

  async getByEmail (email: string): Promise<User> {
    return await this.request<User>({ url: '/users', params: { email } })
  }

  async getByUsername (username: string): Promise<User> {
    return await this.request<User>({ url: '/users', params: { username } })
  }
}
