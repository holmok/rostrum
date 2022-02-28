export interface SimpleRequest {
  message: string
}

export interface SimpleResponse {
  message: string
  timestamp: Date
  status: string
  success: boolean
  host: string
}
