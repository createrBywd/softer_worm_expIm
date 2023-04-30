import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './packages/pages/login/login';
import Reg from './packages/pages/register/reg';
import Page from './packages/pages/Page/Page';
import useStore from './packages/reducer/index';
import { NativeBaseProvider, extendTheme } from 'native-base';

const Stack = createNativeStackNavigator();
const them = extendTheme({
  components: {
    Box: {
      baseStyle: {},
    },
    Center: {
      defaultProps: {
        flexDirection: 'row',
      },
    },
  },
});
export default function App() {
  useEffect(() => {}, []);
  return (
    <NativeBaseProvider theme={them}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="login">
            <Stack.Screen
              name="login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="register"
              component={Reg}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Page"
              options={{
                headerShown: false,
              }}
            >
              {(props) => <Page {...props} store={useStore} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
