import { request } from '../utils/request'
export const goLogin = (data: any) => {
  return request('/login', {
    method: 'post',
    data,
  })
}
export const getUserList = (params: any) => {
  return request('/getuser', {
    method: 'get',
    params,
  })
}
export const getMineInfo = () => {
  return request('/getMineInfo', {
    method: 'get',
  })
}
export const saveText = (data: any) => {
  return request('/saveContent', {
    method: 'post',
    data,
  })
}
export const getMsgList = (params: any) => {
  return request(`/getContentById`, {
    method: 'get',
    params,
  })
}
export const sendEmail = (data: any) => {
  return request('/sendCode', {
    method: 'post',
    data,
  })
}
export const reg = (data: any) => {
  return request('/register', {
    method: 'post',
    data,
  })
}
