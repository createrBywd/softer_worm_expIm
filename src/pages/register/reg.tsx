import React, { useEffect, useState } from 'react'
import { sendEmail, reg } from '../../api/login'
import { Box } from 'native-base'
import {
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native'
import DefaultForm from '../../components/DefaultForm'
import { LinearGradient } from 'expo-linear-gradient'
import useStore from '../../reducer/index'

export default function Reg({
  navigation: { goBack },
}: any) {
  const { useMobxStore } = useStore()
  const { setRegesiter, regesiter, setToken }: any =
    useMobxStore
  const [Info, setResInfo] = useState({
    ...regesiter,
  })
  const [errobj, setEerrors] = useState({})
  const [time, setTime] = useState(60)
  const [textOrTime, setStatus] = useState(true)
  const submit = async () => {
    const set = await setRegesiter(Info)
    // 验证成功跳转 (暂未验证)
    const { code, msg, token } = await reg(Info)
    if (code === 200) {
      goBack()
    }
  }
  const validate = (key: string) => {
    if (key == 'Code') {
      if (Info['code']) setEerrors({ ...errobj, Code: '' })
      else {
        setEerrors({ ...errobj, Code: '请输入验证码' })
        return false
      }
    }
    if (key == 'Email') {
      if (Info['email'])
        setEerrors({ ...errobj, Email: '' })
      else {
        setEerrors({ ...errobj, Email: '请输入邮箱' })
        return false
      }
    }
    if (key == 'Password') {
      if (Info['password'])
        setEerrors({ ...errobj, Password: '' })
      else {
        setEerrors({ ...errobj, Password: '请输入密码' })
        return false
      }
    }
    return true
  }
  const setInputContent = (e: any, prop: any) => {
    switch (prop) {
      case 'code':
        setResInfo({ ...Info, code: e })
        break
      case 'email':
        setResInfo({ ...Info, email: e })
        break
      case 'password':
        setResInfo({ ...Info, password: e })
        break
    }
  }
  const computedTime = async () => {
    if (!textOrTime) return false
    let times = 60
    const { code } = await sendEmail({
      email: Info['email'],
    })
    setStatus(false)
    const timer = setInterval(async () => {
      times -= 1
      setTime(times)
      if (times <= 0) {
        clearInterval(timer)
        times = 60
        setTime(times)
        setStatus(true)
      }
    }, 1000)
  }
  return (
    <Box
      width="100%"
      height="100%"
      padding="30"
      backgroundColor="#111118"
      justifyContent="center"
    >
      <Box bottom="10%">
        <Text
          style={{
            color: '#fff',
            fontWeight: '600',
            fontSize: 23,
          }}
        >
          Create
        </Text>
        <Text
          style={{
            color: '#fff',
            fontWeight: '600',
            fontSize: 23,
          }}
        >
          your account
        </Text>
      </Box>
      <Box alignItems="center">
        {Object.keys(Info).map(
          (val: string, _key: number) => {
            const vals =
              val[0].toLocaleUpperCase() +
              val.slice(1, val.length)
            return DefaultForm({
              key: val,
              label: vals,
              type: val == 'password' ? 'password' : 'text',
              InputRightElement:
                val == 'code' ? (
                  <Text
                    style={{
                      color: 'white',
                      marginRight: 30,
                    }}
                    onPress={() => computedTime()}
                  >
                    {textOrTime
                      ? '获取验证码'
                      : `${time}秒后重新获取`}
                  </Text>
                ) : (
                  ''
                ),
              changeText: (
                e: React.SetStateAction<string>
              ) => setInputContent(e, val),
              blurText: () => validate(vals),
              errors: errobj,
            })
          }
        )}
        <TouchableOpacity
          style={{
            width: '100%',
          }}
          onPress={() => submit()}
        >
          <LinearGradient
            style={styles.linear}
            colors={[
              '#fd8a5b',
              '#f77881',
              '#f163ae',
              '#ec54d0',
            ]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.6, y: 0 }}
          >
            <Text
              style={{
                fontWeight: '600',
                fontSize: 16,
                color: 'white',
              }}
            >
              Continue
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Box>
    </Box>
  )
}
const styles = StyleSheet.create({
  linear: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 15,
  },
  contain: {
    flex: 1,
    padding: '30',
    backgroundColor: '#111118',
    justifyContent: 'center',
  },
})
