export interface EchoRequest {
  message: string
  delay?: number
}

export interface EchoResponse {
  message: string
  timestamp: Date
  status: string
  success: boolean
  host: string
  name: string
  environment: string
}

export interface ReadyResponse {
  status: string
}

export interface OkayResponse {
  status: string
}
