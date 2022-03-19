import { IConfig } from 'config'
import { Logger } from 'pino'
import UserData, { UserDataRow } from '../data/user-data'
import { User, UserType, UserStatus, Page, UserRegister, UserUpdate } from '@ninebyme/common'
import JWT from 'jsonwebtoken'
import Crypto from 'crypto'

class UserService {
  private readonly jwtSecret: string
  constructor (
    private readonly data: UserData,
    config: IConfig,
    private readonly logger: Logger
  ) {
    this.jwtSecret = config.get('jwtSecret')
  }

  private hashPassword (password?: string): string | undefined {
    if (password == null) return undefined
    const hash = Crypto.createHash('sha512')
    hash.update(password)
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

  async register (user: UserRegister): Promise<User> {
    const row = await this.data.create({
      email: user.email,
      username: user.username,
      passwordHash: this.hashPassword(user.password),
      type: UserType.USER,
      status: UserStatus.ACTIVE
    })
    return this.fromDataRow(row) as User
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
    return this.fromDataRow(row)
  }

  async update (user: UserUpdate): Promise<User | undefined> {
    const oldUser = await this.getById(user.id)
    if (oldUser == null) return undefined
    const update: UserDataRow = {
      ...oldUser,
      ...user,
      updated: new Date()
    }
    if (user.password != null) {
      update.passwordHash = this.hashPassword(user.password)
    }
    const row = await this.data.update(update)
    return this.fromDataRow(row) as User
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
