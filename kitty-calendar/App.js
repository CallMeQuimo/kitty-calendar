import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const MyStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <MyStack.Navigator>
        <MyStack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: 'Pantalla de Bienvenida (sin login)' }}
        />
        <MyStack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio de la App' }}
        />
        <MyStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Mi Perfil' }}
        />
      </MyStack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});