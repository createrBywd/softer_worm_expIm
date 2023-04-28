import { request } from '../utils/request';
export const goLogin = async (data: any) => {
  return await request('/login', {
    method: 'post',
    data,
  });
};
export const getUserList = async (params: any) => {
  return await request('/getuser', {
    method: 'get',
    params,
  });
};
export const getMineInfo = async () => {
  return await request('/getMineInfo', {
    method: 'get',
  });
};
export const saveText = async (data: any) => {
  return await request('/saveContent', {
    method: 'post',
    data,
  });
};
export const getMsgList = async (params: any) => {
  return await request(`/getContentById`, {
    method: 'get',
    params,
  });
};
export const sendEmail = async (data: any) => {
  return await request('/sendCode', {
    method: 'post',
    data,
  });
};
export const reg = async (data: any) => {
  return await request('/register', {
    method: 'post',
    data,
  });
};
