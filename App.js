import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Importamos los íconos
import { initDatabase } from './db/database';

// --- 1. Contexto de Autenticación ---
import { AuthProvider, useAuth } from './context/AuthContext';

// --- 2. Pantallas de Autenticación (AuthStack) ---
// Importamos las pantallas que YA existen
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen'; // <-- IMPORTAMOS PROFILE AUNQUE NO SEA PARTE DEL AUTHSTACK
import LoginScreen from './screens/LoginScreen';

// --- 3. Pantallas del Módulo Diario (DiaryStack) ---
// TODO: Crear e importar DiaryMainScreen
// import DiaryMainScreen from './screens/DiaryMainScreen';
// ... (resto de imports comentados)

// --- 4. Pantallas del Módulo Bloques (BlocksStack) ---
// TODO: Crear e importar BlockLibraryScreen
// import BlockLibraryScreen from './screens/BlockLibraryScreen';
// ... (resto de imports comentados)

// --- 5. Pantallas del Módulo Calendario (CalendarStack) ---
// TODO: Crear e importar CalendarScreen
// import CalendarScreen from './screens/CalendarScreen';
// ... (resto de imports comentados)

// --- 6. Pantallas Globales (MainStack) ---
import DashboardScreen from './screens/DashboardScreen';
// import SettingsScreen from './screens/SettingsScreen';


// --- Inicializamos los Navegadores ---
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const DiaryTabStack = createStackNavigator();
const BlocksTabStack = createStackNavigator();
const CalendarTabStack = createStackNavigator();


// --- Definimos los Stacks de cada Pestaña ---
// (Esqueletos por ahora)

function DiaryStack() {
  return (
    <DiaryTabStack.Navigator>
      {/* <DiaryTabStack.Screen name="DiaryMain" component={DiaryMainScreen} options={{ title: 'Diario' }} /> */}
    </DiaryTabStack.Navigator>
  );
}

function BlocksStack() {
  return (
    <BlocksTabStack.Navigator>
      {/* <BlocksTabStack.Screen name="BlockLibrary" component={BlockLibraryScreen} options={{ title: 'Mis Bloques' }} /> */}
    </BlocksTabStack.Navigator>
  );
}

function CalendarStack() {
  return (
    <CalendarTabStack.Navigator>
      {/* <CalendarTabStack.Screen name="CalendarMain" component={CalendarScreen} options={{ title: 'Calendario' }} /> */}
    </CalendarTabStack.Navigator>
  );
}

// --- Definimos el Navegador de Pestañas (Bottom Tabs) ---
function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'DiaryTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'BlocksTab') {
            iconName = focused ? 'layers' : 'layers-outline';
          } else if (route.name === 'CalendarTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          // Fallback icon just in case
          if (!iconName) {
            iconName = 'ellipse-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5', 
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* <Tab.Screen name="DiaryTab" component={DiaryStack} options={{ title: 'Diario' }} /> */}
      {/* <Tab.Screen name="BlocksTab" component={BlocksStack} options={{ title: 'Bloques' }} /> */}
      {/* <Tab.Screen name="CalendarTab" component={CalendarStack} options={{ title: 'Calendario' }} /> */}
       {/* Pantalla temporal para que la app no crashee, luego la borramos */}
       <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{ title: 'Inicio' }} 
      />
    </Tab.Navigator>
  );
}

// --- Definimos el Flujo de Navegación ---
function NavigationLayout() {
  const { userToken, isLoading } = useAuth();

  // 1. Splash Screen mientras carga el AuthContext
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {userToken == null ? (
        // 2. Flujo de Autenticación (Usuario NO logueado)
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
          
          <AuthStack.Screen name="Login" component={LoginScreen} />
          
          <AuthStack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: true, title: 'Crear Cuenta' }} // Mostramos header aquí
          />

          {/* ¡AQUÍ ESTÁ LA MAGIA! Añadimos Profile al stack de auth para testear */}
          <AuthStack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: true, title: 'Test API Feriados' }}
          />

        </AuthStack.Navigator>
      ) : (
        // 3. Flujo Principal (Usuario SÍ logueado)
        <MainStack.Navigator>
          {/* El Dashboard (con las pestañas) es la pantalla principal */}
          <MainStack.Screen
            name="Dashboard"
            component={DashboardTabs}
            options={{ headerShown: false }} // El Tab Navigator maneja sus propios headers
          />
          {/* --- Pantallas Modales (se abren por encima de las pestañas) --- */}
          {/* <MainStack.Screen name="Settings" component={SettingsScreen} options={{ presentation: 'modal', title: 'Configuración' }} /> */}
        </MainStack.Navigator>
      )}
    </NavigationContainer>
  );
}

// --- Punto de Entrada Principal ---
export default function App() {
React.useEffect(() => {
  initDatabase()
    .then(() => {
      console.log('Base de datos inicializada correctamente');
    })
    .catch((err) => {
      console.error('Error al inicializar la base de datos: ', err);
    });
}, []);
  return (
    <AuthProvider>
      <NavigationLayout />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
