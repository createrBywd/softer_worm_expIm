import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatList from '../../components/ChatList';
import Chats from '../../components/Chats';
const Stack = createNativeStackNavigator();

const Chat = ({ socket, store, route }: any): React.ReactElement => {
  const { useMobxStore } = store();
  const { setRouteName } = useMobxStore;
  setRouteName(route.name);
  return (
    <Stack.Navigator initialRouteName="chat_list">
      <Stack.Screen
        name="chat_list"
        options={{
          headerShown: false,
        }}
      >
        {(props) => <ChatList {...props} socket={socket} store={store} />}
      </Stack.Screen>
      <Stack.Screen
        name="chats"
        options={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleAlign: 'center',
          headerTintColor: '#3c5063',
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: '700',
          },
          headerBackVisible: false,
          headerTitle: '',
        }}
      >
        {(props) => <Chats {...props} socket={socket} store={store} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export default Chat;
