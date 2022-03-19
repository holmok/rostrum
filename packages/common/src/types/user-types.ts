import { SortOrder } from '.'

export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
  EDITOR = 'editor',
}

export enum UserStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  DELETED = 'deleted',
}

export interface Page {
  offset: number
  limit: number
  sortBy: string
  order: SortOrder
}

export interface User {
  id: number
  email: string
  username: string
  type: UserType
  status: UserStatus
}

export interface UserUpdate {
  id: number
  email?: string
  username?: string
  password?: string
  created?: Date
  updated?: Date
  lastLogin?: Date
  type?: UserType
  status?: UserStatus
}

export interface UserRegister {
  email: string
  username: string
  password: string
}
