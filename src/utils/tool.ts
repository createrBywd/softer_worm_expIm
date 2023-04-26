import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Network from 'expo-network'
import * as FileSystem from 'expo-file-system'
import { deflate } from 'pako'
export const getToken = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key)
  } catch {}
}
export const setToken = async (key: string, val: any) => {
  try {
    return await AsyncStorage.setItem(key, val)
  } catch {}
}
export const getIp = async () => {
  try {
    return await Network.getIpAddressAsync()
  } catch {}
}
export const getWaveformData = (status: {
  durationMillis: number
  metering: { amplitude: number[] }
}) => {
  const waveformData = []
  const maxAmplitude = 32767 // Maximum amplitude for a 16-bit signed PCM audio sample
  const step = Math.floor(status.durationMillis / 100)
  for (let i = 0; i < status.durationMillis; i += step) {
    const amplitude =
      status?.metering?.amplitude?.[0] / maxAmplitude || 0
    const y = amplitude * 50
    waveformData.push(`${i},${y}`)
  }
  return waveformData
}
export const UploadRequest = async (
  url: string,
  params: any
) => {
  try {
    const BaseUrl = `http://172.31.48.16:8081/api` // 域名地址，根据自己的修改
    const { file: path, isNotuploadAws } = params
    const base64Data = await FileSystem.readAsStringAsync(
      path,
      { encoding: 'base64' }
    )
    console.log(base64Data.length)

    const { body } = await FileSystem.uploadAsync(
      `${BaseUrl}${url}`,
      path,
      {
        fieldName: 'file',
        httpMethod: 'POST',
        uploadType:
          FileSystem.FileSystemUploadType.MULTIPART,
        parameters: {
          ...params,
          file: isNotuploadAws ? base64Data : path,
        },
      }
    )
    const result = JSON.parse(body)
    return result
  } catch (error) {
    console.log(error)
  }
}
export const uploadFile = async (params: any) => {
  const file = {
    ...params,
    type: 'multipart/form-data',
  } // 注意 `uri` 表示文件地址，`type` 表示接口接收的类型，一般为这个，跟后端确认一下

  return await UploadRequest('/upload', file) // `UploadRequest` 上传也是封装过，具体参考下面
}
export const convertEmojiToUnicode = (text: string) => {
  let unicodeText = ''
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i)
    if (
      char.charCodeAt(0) >= 55296 &&
      char.charCodeAt(0) <= 56319
    ) {
      // If char is a high surrogate
      if (i < text.length - 1) {
        const nextChar = text.charAt(i + 1)
        if (
          nextChar.charCodeAt(0) >= 56320 &&
          nextChar.charCodeAt(0) <= 57343
        ) {
          // If nextChar is a low surrogate
          const codePoint =
            (char.charCodeAt(0) - 55296) * 1024 +
            (nextChar.charCodeAt(0) - 56320) +
            65536
          unicodeText +=
            '\\u' + codePoint.toString(16) + ';'
          i++
          continue
        }
      }
    }
    unicodeText += char
  }
  return unicodeText
}
