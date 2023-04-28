import React, { type ReactElement } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../home/home';
import ChatScreen from '../../pages/chat/chat';
import UserScreen from '../user/user';
import { Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Shadow } from 'react-native-shadow-2';
import { Box } from 'native-base';
import { io } from 'socket.io-client';
const socket = io(`http://172.31.48.16:8081`);

const Tab = createBottomTabNavigator();
function MyTabBar({ state, navigation, store, route }: any) {
  const { useMobxStore } = store();
  const { userInfo, routeName } = useMobxStore;
  socket.emit('setRoom', userInfo);
  return routeName == 'chats' ? (
    <></>
  ) : (
    <Shadow
      offset={[0, 2]}
      startColor="#f0eff1"
      distance={20}
      style={{
        flexDirection: 'row',
        position: 'relative',
      }}
    >
      {state.routes.map((route: any, index: any) => {
        const isFocused = state.index === index;
        const tabbarObj: any = {
          home: {
            ttf: Ionicons,
            icon: 'ios-planet-outline',
            text: 'Home',
          },
          chat: {
            ttf: Ionicons,
            icon: 'md-chatbubbles-outline',
            text: 'Message',
          },
          user: {
            ttf: Ionicons,
            icon: 'md-person-outline',
            text: 'Profile',
          },
        };
        const tabbarComponent = (Config: any) => {
          const routeName: any = route.name;
          const FontComponent = tabbarObj[routeName]?.ttf;
          const { icon } = tabbarObj[routeName];
          return (
            <FontComponent
              name={isFocused ? icon.replace('-outline', '') : icon}
              {...Config}
            ></FontComponent>
          );
        };
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({
              name: route.name,
              merge: true,
            });
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            key={route.name}
            style={{
              flex: 1,
              backgroundColor: 'white',
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {tabbarComponent({
              size: route.name == 'home' ? 26 : 24,
              color: isFocused ? '#4f7cfe' : '#4a4a4a',
            })}
            {
              <Box
                _text={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: isFocused ? '#4f7cfe' : '#4a4a4a',
                }}
                marginTop="1"
              >
                {tabbarObj[route?.name]?.text}
              </Box>
            }
          </Pressable>
        );
      })}
    </Shadow>
  );
}
const Page = ({ store }: any) => {
  return (
    <Tab.Navigator
      initialRouteName="chat"
      tabBar={(props): ReactElement<any> => (
        <MyTabBar {...props} store={store}></MyTabBar>
      )}
    >
      <Tab.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <HomeScreen {...props} socket={socket} store={store} />}
      </Tab.Screen>
      <Tab.Screen
        name="chat"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <ChatScreen {...props} socket={socket} store={store} />}
      </Tab.Screen>
      <Tab.Screen
        name="user"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <UserScreen {...props} socket={socket} store={store} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default Page;
