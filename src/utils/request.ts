import axios, { type AxiosRequestConfig } from 'axios';
import { getToken, getIp } from './tool';
const client = axios.create({
  baseURL: `http://172.31.48.16:8081/api`,
});
export async function request(url: string, config: AxiosRequestConfig) {
  const token = await getToken('authToken');
  // const ip = await getIp()
  // console.log(ip)

  config.headers = {
    Authorization: token,
  };
  const response = await client.request({ url, ...config });
  const result = response.data;
  return result;
}

export default client;
