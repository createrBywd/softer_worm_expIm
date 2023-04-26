export interface ApiResult<T> {
  code: number
  data?: string | number | Array<T>[] | Object
  msg: string
  token?: string
}
