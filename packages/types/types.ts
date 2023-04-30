export interface ApiResult<T> {
  code: number;
  data?: string | number | T[][] | Object;
  msg: string;
  token?: string;
}
