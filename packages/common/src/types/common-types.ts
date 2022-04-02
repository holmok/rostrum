export interface Pager {
  offset: number
  limit: number
  sortBy: string
  order: SortOrder
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}
