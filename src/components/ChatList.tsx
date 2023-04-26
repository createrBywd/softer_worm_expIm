import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native'
import {
  Box,
  Input,
  HStack,
  FlatList,
  VStack,
  Avatar,
  Spacer,
  Text,
} from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getUserList } from '../api/login'
type UserList<T> = { [K in keyof T]?: T[K] }

const Home = ({ store, navigation }: any) => {
  const [place, setPlace] = useState('search')
  const { useMobxStore } = store()
  const { userInfo } = useMobxStore
  const [userList, setUserList] = useState([])
  const fadeIn = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      useNativeDriver: true,
      duration: 500,
      easing: Easing.ease,
    }).start()
    getUserList({ email: userInfo['email'] }).then(
      ({ data }) => {
        setUserList(data)
      }
    )
  }, [])

  return (
    <Box flex="1" bg="#ffffff" paddingX="5">
      <Box position="relative" top="50" width="100%">
        <Box
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
        >
          <Box
            _text={{
              fontWeight: 600,
              color: '#4f7cfe',
              fontSize: 26,
            }}
          >
            Message
          </Box>
          <Ionicons
            name="ios-add-circle-outline"
            color="#333"
            size={30}
            style={{
              fontWeight: '600',
            }}
          ></Ionicons>
        </Box>
        <Input
          placeholder={place}
          fontSize="16"
          bg="#f7f7f7"
          placeholderTextColor="#cecece"
          cursorColor="#cecece"
          justifyContent="center"
          alignItems="center"
          borderRadius="10"
          height="45"
          mt="5"
          fontWeight="500"
          onFocus={() => setPlace('')}
          onBlur={() => setPlace('search')}
          InputLeftElement={
            <Ionicons
              name="search"
              size={18}
              color="#cecece"
              style={{ marginLeft: 20 }}
            ></Ionicons>
          }
        ></Input>
        <TouchableOpacity style={{ marginTop: 15 }}>
          {/* <Shadow
            startColor="#bfd5f3"
            distance={5}
            style={styles.shadowBox}
          >
            <Box
              _text={{ color: '#fff', fontWeight: '600' }}
            >
              Contacts
            </Box>
          </Shadow> */}
        </TouchableOpacity>
        <Box>
          <FlatList
            data={userList}
            renderItem={({ item, index }: any) => (
              <Animated.View
                style={{
                  opacity: fadeIn,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('chats', item)
                  }
                >
                  <Box
                    borderBottomWidth="1"
                    _dark={{
                      borderColor: '#eef2f6',
                    }}
                    borderColor="#eef2f6"
                    pl={['0', '4']}
                    pr={['0', '5']}
                    py="4"
                  >
                    <HStack
                      space={[2, 3]}
                      justifyContent="space-between"
                    >
                      <Avatar
                        size="48px"
                        source={{
                          uri: item.avatarUrl,
                        }}
                      />
                      <VStack>
                        <Text
                          _dark={{
                            color: '#113260',
                          }}
                          color="#113260"
                          fontWeight="500"
                        >
                          {item.fullName}
                        </Text>
                        <Text
                          color="#9eabbd"
                          _dark={{
                            color: '#9eabbd',
                          }}
                          fontSize="xs"
                          fontWeight="500"
                        >
                          {item.recentText}
                        </Text>
                      </VStack>
                      <Spacer />
                      <Text
                        fontSize="xs"
                        _dark={{
                          color: '#9eabbd',
                        }}
                        color="#9eabbd"
                        alignSelf="flex-start"
                      >
                        {item.timeStamp}
                      </Text>
                    </HStack>
                  </Box>
                </TouchableOpacity>
              </Animated.View>
            )}
            keyExtractor={(item: any) => item.fullName}
          ></FlatList>
        </Box>
      </Box>
    </Box>
  )
}
const styles = StyleSheet.create({
  shadowBox: {
    width: 100,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#3389ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default Home
