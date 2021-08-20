import React from "react";
import { View, Text } from 'react-native';
import { Link, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import BabylonJs from './pages/babylonjs';
import Sandbox from './pages/sandbox';
import Minecraft from './pages/Minecraft';
import Storage from './pages/Storage';
import FileSystemView from "./pages/FileSystem";
import WebAudioView from "./pages/WebAudio";

const Stack = createStackNavigator();

const linking = {
  prefixes: ['http://localhost:3000', 'myapp://'],
  config: {
    screens: {
      Home: '',
      babylonjs: '/babylonjs',
      filesystem: '/filesystem',
      sandbox: '/sandbox',
      minecraft: '/minecraft',
      storage: '/storage',
      webaudio: '/webaudio',
    }
  },
};

const Home = () => {
  return <View style={{flex: 1, flexDirection: 'column'}}>
    <Link to="/babylonjs">Babylonjs</Link>
    <Link to="/sandbox">Sandbox</Link>
    <Link to="/minecraft">Minecraft</Link>
    <Link to="/storage">storage</Link>
    <Link to="/webaudio">WebAudio</Link>
  </View>
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
        <Stack.Screen name="storage" component={Storage} />
        <Stack.Screen name="filesystem" component={FileSystemView} />
        <Stack.Screen name="webaudio" component={WebAudioView} />
      </Stack.Navigator>
    </NavigationContainer>
  </View>)
}

export default App;
