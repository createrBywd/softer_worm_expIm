import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
  Pressable,
} from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import {
  Center,
  Box,
  FormControl,
  Input,
  WarningOutlineIcon,
} from 'native-base'
import { goLogin, getMineInfo } from '../../api/login'
import useStore from '../../reducer/index'
import { ApiResult } from '../../types/types'
import { setToken } from '../../utils/tool'
export default function Login({ navigation }: any) {
  const { useMobxStore } = useStore()
  const { setMyInfo, userInfo } = useMobxStore
  const fadeAnim = useRef(new Animated.Value(-200)).current
  const fadeIn = useRef(new Animated.Value(0)).current
  const [loginInfo, setLoginInfo] = useState({
    ...userInfo,
  })
  const infineResult: ApiResult<any> = { code: 0, msg: '' }
  const [loginResult, setResult] = useState(infineResult)
  const [a, onUserNameColorChange] =
    React.useState('#f4f4f4')
  const [c, onPasswordColorChange] =
    React.useState('#f4f4f4')
  const scale = fadeIn.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })
  useEffect(() => {
    Animated.spring(fadeAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 20,
      speed: 8,
    }).start()
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start()
  }, [fadeAnim, fadeIn])
  const login = async () => {
    const { code, token, msg } = await goLogin(loginInfo)
    await setResult({ code, token, msg })
    if (code === 200) {
      await setToken('authToken', token)
      const { code, data } = await getMineInfo()
      if (code == 200) setMyInfo(data)
      navigation.navigate('Page')
    }
  }
  return (
    <View style={loginStyles.container}>
      <Center
        width="100%"
        position="relative"
        alignItems="center"
        bottom="40%"
      >
        <Image
          source={require('../../assets/img/logo.png')}
          style={{ width: 30, height: 30 }}
        ></Image>
        <Box
          _text={{
            color: '#9596a1',
            fontWeight: 600,
            fontSize: 18,
            marginLeft: 1,
          }}
        >
          terhie
        </Box>
      </Center>

      <Animated.Text
        style={[
          loginStyles.title,
          { transform: [{ translateY: fadeAnim }] },
        ]}
      >
        Welcome Back!
      </Animated.Text>
      <Text style={loginStyles.des}>
        Record life And Chat
      </Text>
      <FormControl style={{ width: '100%', marginTop: 80 }}>
        <FormControl.Label style={loginStyles.tooltip}>
          Username
        </FormControl.Label>
        <Input
          height="39"
          borderBottomColor={a}
          borderBottomWidth="1"
          borderWidth="0"
          backgroundColor="white"
          rounded="none"
          fontSize="17"
          letterSpacing="1"
          color="#111118"
          placeholder="Email"
          onFocus={() => onUserNameColorChange('#7387f9')}
          onBlur={() => onUserNameColorChange('#f4f4f4')}
          onChangeText={(e) =>
            setLoginInfo({ ...loginInfo, email: e })
          }
        ></Input>
        <FormControl.ErrorMessage
          color="red"
          fontSize="20"
          leftIcon={<WarningOutlineIcon size="xs" />}
        ></FormControl.ErrorMessage>
      </FormControl>
      <FormControl style={{ width: '100%', marginTop: 25 }}>
        <FormControl.Label style={loginStyles.tooltip}>
          Password
        </FormControl.Label>
        <Input
          type="password"
          height="39"
          borderBottomColor={c}
          borderBottomWidth="1"
          borderWidth="0"
          backgroundColor="white"
          rounded="none"
          fontSize="17"
          placeholder="Password"
          onFocus={() => onPasswordColorChange('#7387f9')}
          onBlur={() => onPasswordColorChange('#f4f4f4')}
          onChangeText={(e) =>
            setLoginInfo({ ...loginInfo, password: e })
          }
        ></Input>
        <FormControl.ErrorMessage color="red" fontSize="20">
          请输入密码
        </FormControl.ErrorMessage>
      </FormControl>
      {loginResult['code'] === 500 ? (
        <Center w="100%" marginTop="5">
          <Box _text={{ color: '#e54032' }}>
            账号或密码错误
          </Box>
        </Center>
      ) : (
        ''
      )}
      <Animated.View
        style={[
          loginStyles.animatedView,
          {
            opacity: fadeIn,
            transform: [{ scale: scale }],
          },
        ]}
      >
        <TouchableOpacity
          style={loginStyles.touchContain}
          onPress={() => login()}
        >
          <LinearGradient
            style={loginStyles.loginbtn}
            colors={['#797ef8', '#7288f9', '#5fa2fb']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.6, y: 0 }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: '600',
              }}
            >
              LOG IN
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <View style={loginStyles.signContain}>
        <Text>Don't have an account yet?</Text>
        <Pressable
          onPress={() => navigation.navigate('register')}
          android_ripple={{ color: '#7288f9' }}
        >
          <Text
            style={{
              color: '#203152',
              fontSize: 13,
              fontWeight: '600',
            }}
          >
            SIGN UP NOW
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 30,
  },
  title: {
    fontWeight: '800',
    fontSize: 23,
    color: '#333',
    position: 'relative',
  },
  des: {
    fontSize: 16,
    fontWeight: '500',
    color: '#d9d8d8',
  },
  tooltip: {
    fontWeight: '600',
    fontSize: 12,
    color: '#cacaca',
    marginBottom: 5,
  },
  animatedView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginbtn: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  touchContain: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signContain: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: 150,
  },
})
