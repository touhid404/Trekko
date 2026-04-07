export interface IResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string | Record<string, unknown>
  statusCode?: number
}
