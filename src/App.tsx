import React from "react";
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import BabylonJs from './babylonjs';
import Sandbox from './sandbox';
import Minecraft from './minecraft';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['http://localhost:3000', 'myapp://'],
  config: {
    screens: {
      Home: '',
      babylonjs: '/babylonjs',
      sandbox: '/sandbox',
      minecraft: '/minecraft',
    }
  },
};

const Home = () => {
  return <View style={{flex: 1}}><Text>Hello World</Text></View>
}

const App = () => {

  return (
  <View style={{height: '100%', width: '100%'}}>
    <NavigationContainer linking={linking} fallback={<SplashScreen />}>
      <Stack.Navigator initialRouteName="Home" headerMode="none">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }}/>
        <Stack.Screen name="babylonjs" component={BabylonJs} />
        <Stack.Screen name="sandbox" component={Sandbox} />
        <Stack.Screen name="minecraft" component={Minecraft} />
      </Stack.Navigator>
    </NavigationContainer>
  </View>)
}

export default App;
