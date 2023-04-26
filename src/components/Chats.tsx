import {
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  Animated,
  Easing,
  Vibration,
  Text,
  TextInput,
} from 'react-native'
import React, { PureComponent, Component } from 'react'
import { Box, HStack, VStack, Toast } from 'native-base'
import { Shadow } from 'react-native-shadow-2'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { saveText, getMsgList } from '../api/login'
import { rootStore } from '../reducer'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { Audio } from 'expo-av'
import { useAnimated } from '../hooks/global'
import MoreOptions from './MoreOptions'
import {
  uploadFile,
  convertEmojiToUnicode,
} from '../utils/tool'
import EmojiSelector from './EmojiSelector'
class ChatItem extends Component {
  state: any = {}
  initAnit: any[] = [...Array(3).fill(0)].map(
    () => new Animated.Value(1)
  )
  constructor(props: Readonly<any>) {
    super(props)
    this.state = {
      rssArr: this.initAnit,
      sound: new Audio.Sound(),
      isPlayIng: false,
    }
  }
  loopAudio = async ({ file }: any) => {
    this.setState(
      {
        isPlayIng: !this.state.isPlayIng,
      },
      async () => {
        if (this.state.isPlayIng) {
          const allTime = this.state.rssArr.length
          await this.state.sound.loadAsync({
            uri: 'data:audio/mp4;base64,' + file,
          })
          const { durationMillis } =
            await this.state.sound.playAsync()
          const timeout = setTimeout(async () => {
            await this.state.sound.unloadAsync()
            this.setState({
              isPlayIng: false,
            })
            this.state.rssArr.forEach((val: any) => {
              val.setValue(1)
            })
            clearTimeout(timeout)
          }, durationMillis)
          const animated = (index: any) =>
            Animated.timing(this.state.rssArr[index], {
              toValue: 0,
              duration: 1000,
              delay: (allTime - index) * 200,
              useNativeDriver: true,
              easing: Easing.ease,
            })
          this.state.rssArr.map((val: any, index: any) => {
            Animated.loop(animated(index), {
              iterations: Math.floor(durationMillis / 1000),
            }).start()
          })
        } else {
          await this.state.sound.unloadAsync()
          this.state.rssArr.forEach((val: any) => {
            val.resetAnimation(() => val.setValue(1))
          })
        }
      }
    )
  }
  render() {
    const { item, userInfo }: any = this.props
    const isAudio = item.fileType === 'audio'
    const isImage = item.fileType === 'image'
    const status = item.audioStatus
      ? JSON.parse(item.audioStatus)
      : null
    const scales = [0.4, 0.6, 1]
    return (
      <VStack p="5">
        {item.sender != userInfo['_id'] ? (
          <HStack
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Image
              contentFit="contain"
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
              }}
              source={require('../../assets/favicon.png')}
            ></Image>
            <Box
              bg="#fff"
              _text={{
                textAlign: 'left',
                color: '#333',
              }}
              maxW={250}
              minH={30}
              px={5}
              py={2}
              borderRadius={10}
              borderTopLeftRadius={0}
              ml="3"
            >
              {item.file && isAudio && !isImage ? (
                <TouchableOpacity
                  onPress={() => this.loopAudio(item)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    _text={{
                      color: '#333',
                      fontSize: 11,
                      marginRight: 2,
                    }}
                  >
                    {status &&
                      Math.floor(
                        status.durationMillis / 1000
                      ) + '"'}
                  </Box>
                  {this.state.rssArr.map(
                    (val: any, index: any) => (
                      <Animated.Text
                        key={index}
                        style={{
                          opacity:
                            this.state.rssArr[2 - index],
                          transform: [
                            { scale: scales[index] },
                          ],
                          color: '#333',
                        }}
                      >
                        {' '}
                        )
                      </Animated.Text>
                    )
                  )}
                </TouchableOpacity>
              ) : item.file && !isAudio && isImage ? (
                <Image
                  source={
                    'data:image/jpeg;base64,' + item.file
                  }
                  style={{ maxWidth: 200, maxHeight: 200 }}
                ></Image>
              ) : (
                <Text
                  style={{
                    color: '#333',
                  }}
                >
                  {item.msg}
                </Text>
              )}
            </Box>
          </HStack>
        ) : (
          <HStack
            justifyContent="flex-end"
            alignItems="flex-start"
          >
            <Box
              bg="#4f7cfe"
              _text={{
                color: '#fff',
                textAlign: 'left',
              }}
              maxW={250}
              minH={30}
              px={5}
              py={2}
              borderRadius={10}
              borderTopRightRadius={0}
              mr={3}
            >
              {item.file && isAudio && !isImage ? (
                <TouchableOpacity
                  onPress={() => this.loopAudio(item)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    _text={{
                      color: '#fff',
                      fontSize: 11,
                      marginRight: 2,
                    }}
                  >
                    {status &&
                      Math.floor(
                        status.durationMillis / 1000
                      ) + '"'}
                  </Box>
                  {this.state.rssArr.map(
                    (val: any, index: any) => (
                      <Animated.Text
                        key={index}
                        style={{
                          opacity: this.state.rssArr[index],
                          transform: [
                            { scale: (3 - index) / 3 },
                          ],
                          fontSize:
                            index ===
                            this.state.rssArr.length - 1
                              ? 16
                              : 14,
                          fontWeight:
                            index ===
                            this.state.rssArr.length - 1
                              ? 800
                              : 400,
                          color: '#fff',
                        }}
                      >
                        {' '}
                        (
                      </Animated.Text>
                    )
                  )}
                </TouchableOpacity>
              ) : item.file && isImage && !isAudio ? (
                <Image
                  source={
                    'data:image/jpeg;base64,' + item.file
                  }
                  style={{ width: 100, height: 100 }}
                ></Image>
              ) : !item.file ? (
                <Text
                  style={{
                    color: '#fff',
                  }}
                >
                  {item.msg}
                </Text>
              ) : (
                <></>
              )}
            </Box>
            <Image
              contentFit="contain"
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
              }}
              source={require('../../assets/favicon.png')}
            ></Image>
          </HStack>
        )}
      </VStack>
    )
  }

  shouldComponentUpdate(nextProps: any) {
    // Use shallow comparison to check if props have changed
    return (
      nextProps.item !== this.props.item ||
      nextProps.userInfo !== this.props.userInfo
    )
  }
}
export class Chats extends PureComponent {
  listRef: React.RefObject<any>
  initOpacity: any
  audioAnimate: any
  WAVEFORM_HEIGHT = 100
  keyboardDidShowListener: any
  state: any = {}
  constructor(props: any) {
    super(props)
    const { navigation, route }: any = props
    const { useMobxStore } = rootStore
    const { setRouteName, setMsgLen, msgLen, userInfo } =
      useMobxStore
    const { fullName, _id } = route.params
    this.state = {
      params: { pageNum: 1, pageSize: 10 },
      total: 0,
      fullName,
      _id,
      useMobxStore,
      setMsgLen,
      setRouteName,
      userInfo,
      msgLen,
      text: '',
      scrollPosition: 0,
      allText: [],
      isFoucs: false,
      recording: new Audio.Recording(),
      sound: new Audio.Sound(),
      waveFormData: [...Array(20).fill(4)],
      animatedHeights: [...Array(20).fill(0)].map(
        () => new Animated.Value(4)
      ),
      audioIndex: 0,
      pressInDate: Date.now(),
      bottomSheet: new Animated.Value(0),
      checkInputAnimated: new Animated.Value(0),
      showInput: true,
      showBo: false,
      showWave: false,
      showOptions: false,
    }
    this.listRef = React.createRef()
    this.audioAnimate = new Animated.Value(0)
    navigation.setOptions({ headerTitle: fullName || '' })
    setRouteName(route['name'])
  }
  _scrollBottom = () => {
    const refs = this.listRef.current
    requestAnimationFrame(() =>
      refs.scrollToEnd({
        animated: true,
      })
    )
  }
  sendMessage = async () => {
    if (this.state.isFoucs) {
      const { route, socket }: any = this.props
      const { _id } = route.params
      // const transformText = convertEmojiToUnicode(this.state.text)
      const text_context = {
        sender: this.state.userInfo['_id'],
        fullName: this.state.userInfo['fullName'],
        avatarUrl: this.state.userInfo['avatarUrl'],
        toId: _id,
        msg: this.state.text,
        timestamp: Date.now(),
      }
      await Promise.all([
        socket.emit('privatemessage', text_context),
        saveText(text_context),
      ])
      this._scrollBottom()
      this.setState({
        text: '',
      })
    } else {
      this.setState({
        showOptions: !this.state.showOptions,
      })
    }
  }
  getHistoryList = async () => {
    const { route }: any = this.props
    const { _id } = route.params
    try {
      const { data, total } = await getMsgList({
        sender: this.state.userInfo['_id'],
        toId: _id,
        ...this.state.params,
      })
      this.setState(
        {
          allText: [...data, ...this.state.allText],
          total,
        },
        () => {
          this.state.setMsgLen(this.state.allText?.length)
        }
      )
    } catch (error) {
      console.error(error)
    }
  }
  onScroll = (e: any) => {
    const {
      contentOffset: { y },
    } = e.nativeEvent
    if (y === 0) {
      this.setState(
        {
          params: {
            ...this.state.params,
            pageNum: this.state.params.pageNum + 1,
          },
        },
        () => {
          const { allText, total } = this.state
          const hasMore = allText.length < total
          if (!hasMore) return
          this.getHistoryList()
          this.listRef.current.scrollToOffset({
            animated: true,
            offset: 200,
          })
        }
      )
    }
  }
  handleReceiveMsg = (context: any) => {
    this.setState(
      (prevState: any) => ({
        allText: [...prevState.allText, context],
      }),
      () => {
        this.state.setMsgLen(this.state.allText?.length)
      }
    )
  }
  onChangeText = (e: any) => {
    this.setState({
      text: e,
    })
  }
  recordAd = async () => {
    try {
      console.log('Requesting permissions..')
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      // start recording...
      this.setState({
        recording: new Audio.Recording(),
        pressInDate: Date.now(),
        showBo: true,
      })
      useAnimated({
        type: 'timing',
        ref: this.audioAnimate,
        toValue: 1,
        useNativeDriver: false,
        duration: 300,
        ease: Easing.ease,
      }).start()
      await this.state.recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      Vibration.vibrate(100)
      this.state.recording.setOnRecordingStatusUpdate(
        this.updateWaveform
      )
      await this.state.recording.startAsync()
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }
  updateWaveform = async (status: any) => {
    const meter = status.metering
    const height = meter
      ? Math.floor(((160 - Math.abs(meter)) / 160) * 10)
      : 0
    const waState = [...Array(20).fill(4)]
    this.setState(
      {
        audioIndex: this.state.audioIndex + 1,
      },
      () => {
        if (this.state.audioIndex >= 20) {
          this.setState({ audioIndex: 0 })
        } else {
          waState[this.state.audioIndex] = height
          waState.map((value: any, index: any | number) => {
            Animated.timing(
              this.state.animatedHeights[index],
              {
                toValue: value,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.linear,
              }
            ).start()
          })
        }
      }
    )
  }
  stopRecordAd = async () => {
    try {
      const status =
        await this.state.recording.stopAndUnloadAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
      })
      this.audioAnimate.resetAnimation()
      const uri = this.state.recording.getURI()
      this.setState({
        recording: undefined,
        waveformData: [],
        audioIndex: 0,
        showBo: false,
      })
      this.transformer({
        file: uri,
        isNotuploadAws: true, // 是否需要上传到aws存储桶
        fileType: 'audio',
        audioStatus: JSON.stringify(status),
      })
      this._scrollBottom()
    } catch (error) {
      console.log(error)
    }
  }
  uploadPicture = async (uri, type) => {
    this.transformer({
      file: uri,
      fileType: type,
      isNotuploadAws: true, // 是否需要上传到aws存储桶
    })
    this._scrollBottom()
  }
  transformer = async (other_params: any) => {
    const { route }: any = this.props
    const { _id } = route.params
    const params = Object.assign(
      {
        sender: this.state.userInfo['_id'],
        fullName: this.state.userInfo['fullName'],
        avatarUrl: this.state.userInfo['avatarUrl'],
        toId: _id,
        timestamp: Date.now(),
      },
      other_params
    )
    const { data } = await uploadFile(params)
    const Context = { ...params, file: data }
    const { socket }: any = this.props
    socket.emit('privatemessage', Context) // 此处等待文件上传至aws云并获取到音频地址后再将文件地址上传至socket，所以会有延时
  }
  selectEmoji = (emo: any) => {
    this.setState({
      text: this.state.text + emo,
    })
  }
  checkEmoji = () => {
    Keyboard.dismiss()
    this.setState({
      showWave: !this.state.showWave,
      showInput: true,
    })
    this._scrollBottom()
    Animated.timing(this.state.bottomSheet, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start()
  }
  checkKeybord = () => {
    this.setState({
      showInput: !this.state.showInput,
    })
  }
  renderItem = ({ item }: any) => {
    return (
      <ChatItem
        item={item}
        userInfo={this.state.userInfo}
      />
    )
  }
  componentDidMount() {
    const { socket }: any = this.props
    this.getHistoryList()
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this._scrollBottom()
      }
    )
    Keyboard.addListener('keyboardDidHide', () => {
      this.setState({
        isFoucs: false,
      })
    })
    socket.on('receiveMsg', this.handleReceiveMsg)
  }
  componentWillUnmount() {
    const { socket }: any = this.props
    this.keyboardDidShowListener.remove()
    socket.off('receiveMsg', this.handleReceiveMsg)
  }
  render() {
    const { allText, text } = this.state
    const bottom = this.audioAnimate.interpolate({
      inputRange: [0, 1],
      outputRange: ['-100%', '0%'],
    })
    const opacity = this.audioAnimate.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
    })

    return (
      <Box flex="1" bg="#fff">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          keyboardVerticalOffset={100}
          contentContainerStyle={{ flex: 1 }}
        >
          <Box flex="1" bg="#fff">
            <Animated.View
              style={[
                styles.audioAnimated,
                { opacity, bottom },
              ]}
            >
              <Image
                source="https://image.meiye.art/pic_n5z3COP0ywt3uBTVcfmv6"
                style={{
                  width: 150,
                  height: 150,
                }}
              ></Image>
            </Animated.View>
            <FlashList
              data={allText}
              ref={this.listRef}
              keyExtractor={(
                item: any,
                index: number
              ): any => index}
              estimatedItemSize={15}
              removeClippedSubviews={true}
              onScroll={this.onScroll}
              renderItem={this.renderItem}
            />
          </Box>
          <Box bg="#fff" height="100" position="relative">
            <Shadow
              style={styles.shadow_box}
              containerStyle={{
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                style={styles.send_button}
                onPress={this.checkKeybord}
              >
                <FontAwesome
                  name="microphone"
                  color="#fff"
                  size={15}
                />
              </TouchableOpacity>
              {this.state.showInput ? (
                <TextInput
                  placeholder="Write message..."
                  style={styles.textInput}
                  cursorColor="gray"
                  onChangeText={this.onChangeText}
                  onFocus={() => {
                    this.setState({
                      showWave: false,
                      isFoucs: true,
                    })
                  }}
                  onBlur={() => {
                    this.setState({
                      isFoucs: false,
                    })
                  }}
                  value={text}
                ></TextInput>
              ) : (
                <TouchableOpacity
                  style={[styles.enterAudio]}
                  onLongPress={this.recordAd}
                  onPressOut={this.stopRecordAd}
                  activeOpacity={0.6}
                >
                  {this.state.showBo ? (
                    <HStack
                      justifyContent="center"
                      alignItems="center"
                    >
                      {this.state.animatedHeights.map(
                        (
                          value: number,
                          index: any | number | bigint
                        ) => {
                          const scale =
                            this.state.animatedHeights[
                              index
                            ]
                          const width = 2
                          const left = index * (width + 2)
                          return (
                            <Animated.View
                              key={index}
                              style={[
                                styles.waveform,
                                {
                                  left,
                                  width,
                                  height: 3,
                                  transform: [
                                    { scaleY: scale },
                                    {
                                      translateX: -30,
                                    },
                                  ],
                                },
                              ]}
                            />
                          )
                        }
                      )}
                    </HStack>
                  ) : (
                    <Text>按住说话</Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.send_button}
                onPress={this.checkEmoji}
              >
                <AntDesign
                  name="smile-circle"
                  color="#fff"
                  size={16}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.send_button}
                onPress={this.sendMessage}
              >
                <FontAwesome
                  name={
                    this.state.isFoucs ? 'send' : 'plus'
                  }
                  color="#fff"
                  size={15}
                  style={{
                    marginRight: this.state.isFoucs ? 3 : 0,
                  }}
                />
              </TouchableOpacity>
            </Shadow>
          </Box>
          {this.state.showWave ? (
            <EmojiSelector
              selectEmoji={(em: any) =>
                this.selectEmoji(em)
              }
            ></EmojiSelector>
          ) : (
            <></>
          )}
          {this.state.showOptions ? (
            <MoreOptions
              uploadPicture={this.uploadPicture}
            ></MoreOptions>
          ) : (
            <></>
          )}
        </KeyboardAvoidingView>
      </Box>
    )
  }
}
const styles = StyleSheet.create({
  send_button: {
    backgroundColor: '#4f7cfe',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow_box: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.8)',
    zIndex: 999,
  },
  bg: {
    width: '60%',
    height: 60,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#4f7cfe',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    backgroundColor: '#000',
  },
  audioAnimated: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0d0d20',
    zIndex: 999,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContainer: {
    width: '100%',
    backgroundColor: '#fff',
    height: 250,
  },
  textInput: {
    width: '60%',
    height: 40,
    borderRadius: 30,
    backgroundColor: '#eff0f5',
    borderWidth: 0,
    paddingHorizontal: 10,
  },
  enterAudio: {
    width: '60%',
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff0f5',
    borderWidth: 0,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Chats
