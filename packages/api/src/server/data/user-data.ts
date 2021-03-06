import { Logger } from 'pino'
import { Knex } from 'knex'
import { UserType, UserStatus, Pager } from '@ninebyme/common'

export interface UserDataRow {
  id?: number
  email: string
  username: string
  passwordHash?: string
  created?: Date
  updated?: Date
  lastLogin?: Date
  type?: UserType
  status?: UserStatus
}

class UserData {
  constructor (
    private readonly knex: Knex,
    private readonly logger: Logger
  ) {
    this.logger.debug('UserData initialized.')
  }

  async create (user: UserDataRow): Promise<UserDataRow> {
    const row = await this.knex<UserDataRow>('users').insert(user).returning('*')
    return row[0]
  }

  async update (user: UserDataRow): Promise<UserDataRow> {
    const row = await this.knex<UserDataRow>('users').update(user).where({ id: user.id }).returning('*')
    return row[0]
  }

  async list (pager: Pager): Promise<UserDataRow[]> {
    const rows = await this.knex<UserDataRow>('users')
      .offset(pager.offset)
      .limit(pager.limit)
      .orderBy(pager.sortBy, pager.order)
      .select()
    return rows
  }

  async getById (id: number): Promise<UserDataRow | undefined> {
    const row = await this.knex<UserDataRow>('users').where({ id }).first()
    return row
  }

  async getByEmail (email: string): Promise<UserDataRow | undefined> {
    const row = await this.knex<UserDataRow>('users').where({ email }).first()
    return row
  }

  async getByUsername (username: string): Promise<UserDataRow | undefined> {
    const row = await this.knex<UserDataRow>('users').where({ username }).first()
    return row
  }

  async getByLogin (email: string, passwordHash: string): Promise<UserDataRow | undefined> {
    const row = await this.knex<UserDataRow>('users').whereILike({ email }).andWhere({ passwordHash }).first()
    return row
  }
}

export default UserData
