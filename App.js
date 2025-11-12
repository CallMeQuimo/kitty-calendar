import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- Importamos SOLO las pantallas que existen ---
// (HomeScreen.js fue eliminada, como acordamos)
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen'; // La mantenemos solo por la prueba de API

// Creamos el Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // Empezamos en la SplashScreen
        initialRouteName="Splash"
      >
        {/* Pantalla de Carga */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }} // Ocultamos el header aquí
        />

        {/* Pantalla de Bienvenida */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }} // Ocultamos el header aquí
        />

        {/* Pantalla de Registro (aunque esté vacía) */}
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: 'Crear Cuenta' }} // Usará el header de React Navigation
        />

        {/* Pantalla de Perfil (para probar la API de feriados) */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Prueba de API Feriados' }} // Usará el header de React Navigation
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

// (Estilos no son necesarios aquí, pero los dejo por si acaso)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});