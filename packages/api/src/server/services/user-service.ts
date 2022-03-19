import { IConfig } from 'config'
import { Logger } from 'pino'
import UserData, { UserDataRow } from '../data/user-data'
import { User, UserType, UserStatus, Page, UserRegisterRequest, UserUpdateRequest } from '@ninebyme/common'
import JWT from 'jsonwebtoken'
import Crypto from 'crypto'

class UserService {
  private readonly jwtSecret: string
  private readonly pwSalt: string
  constructor (
    private readonly data: UserData,
    config: IConfig,
    private readonly logger: Logger
  ) {
    this.jwtSecret = config.get('jwtSecret')
    this.pwSalt = config.get('pwSalt')
  }

  private formatError (error: any): Error {
    if (error.constraint === 'users_email_key') {
      this.logger.warn(error)
      return new Error('400:Email already exists')
    }
    if (error.constraint === 'users_username_key') {
      this.logger.warn(error)
      return new Error('400:Username already exists')
    }
    const parts = /^([1-5][0-9]{2}):(.*)$/g.exec(error.message) ?? []
    if (parts.length === 3) {
      return new Error(`${parts[1]}:${parts[2]}`)
    }
    this.logger.error(error)
    return new Error('500:Failed to create user')
  }

  private hashPassword (password?: string): string | undefined {
    if (password == null) return undefined
    const hash = Crypto.createHash('sha512')
    hash.update(`${password}_${this.pwSalt}`)
    return hash.digest('hex')
  }

  private fromDataRow (row?: UserDataRow): User | undefined {
    if (row == null) return undefined
    return {
      id: row.id as number,
      email: row.email,
      username: row.username,
      type: row.type as UserType,
      status: row.status as UserStatus
    }
  }

  async register (user: UserRegisterRequest): Promise<User> {
    try {
      const row = await this.data.create({
        email: user.email,
        username: user.username,
        passwordHash: this.hashPassword(user.password),
        type: UserType.USER,
        status: UserStatus.ACTIVE
      })
      return this.fromDataRow(row) as User
    } catch (error: any) {
      throw this.formatError(error)
    }
  }

  async list (page: Page): Promise<User[]> {
    const rows = await this.data.list(page)
    return rows.map(this.fromDataRow) as User[]
  }

  async getById (id: number): Promise<User | undefined> {
    const row = await this.data.getById(id)
    return this.fromDataRow(row)
  }

  async getByEmail (email: string): Promise<User | undefined> {
    const row = await this.data.getByEmail(email)
    return this.fromDataRow(row)
  }

  async getByUsername (username: string): Promise<User | undefined> {
    const row = await this.data.getByUsername(username)
    return this.fromDataRow(row)
  }

  async getByLogin (email: string, password: string): Promise<User | undefined> {
    const row = await this.data.getByLogin(email, this.hashPassword(password) as string)
    const user = this.fromDataRow(row)
    if (user != null) await this.update({ id: user.id, lastLogin: new Date() })
    return user
  }

  async update (user: UserUpdateRequest): Promise<User | undefined> {
    try {
      const oldUser = await this.getById(user.id)
      if (oldUser == null) return undefined
      const { newPassword, oldPassword } = user
      delete user.newPassword
      delete user.oldPassword
      const update: UserDataRow = {
        ...oldUser,
        ...user,
        updated: new Date()
      }
      if (newPassword != null && oldPassword != null) {
        const isValid = await this.getByLogin(oldUser.email, oldPassword)
        if (isValid == null) throw new Error('400:Invalid password')
        update.passwordHash = this.hashPassword(newPassword)
      }
      const row = await this.data.update(update)
      return this.fromDataRow(row) as User
    } catch (error: any) {
      throw this.formatError(error)
    }
  }

  tokenize (user?: User): string | undefined {
    if (user == null) return undefined
    return JWT.sign(user, this.jwtSecret)
  }

  validateToken (token?: string): User | undefined {
    if (token == null) return undefined
    try {
      return JWT.verify(token, this.jwtSecret) as User
    } catch (error) {
      this.logger.warn('Invalid token', error)
      return undefined
    }
  }
}

export default UserService
