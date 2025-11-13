import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Importamos los íconos

// --- 1. Contexto de Autenticación ---
import { AuthProvider, useAuth } from './context/AuthContext';

// --- 2. Pantallas de Autenticación (AuthStack) ---
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
// TODO: Crear e importar LoginScreen
// import LoginScreen from './screens/LoginScreen';

// --- 3. Pantallas del Módulo Diario (DiaryStack) ---
// TODO: Crear e importar DiaryMainScreen
// import DiaryMainScreen from './screens/DiaryMainScreen';
// TODO: Crear e importar DiaryCreateEntryScreen
// import DiaryCreateEntryScreen from './screens/DiaryCreateEntryScreen';
// TODO: Crear e importar DiaryStatsScreen
// import DiaryStatsScreen from './screens/DiaryStatsScreen';

// --- 4. Pantallas del Módulo Bloques (BlocksStack) ---
// TODO: Crear e importar BlockLibraryScreen
// import BlockLibraryScreen from './screens/BlockLibraryScreen';
// TODO: Crear e importar BlockCreateEditScreen
// import BlockCreateEditScreen from './screens/BlockCreateEditScreen';
// TODO: Crear e importar BlockActiveScreen
// import BlockActiveScreen from './screens/BlockActiveScreen';
// TODO: Crear e importar RouletteScreen
// import RouletteScreen from './screens/RouletteScreen';
// TODO: Crear e importar BlockHistoryScreen
// import BlockHistoryScreen from './screens/BlockHistoryScreen';

// --- 5. Pantallas del Módulo Calendario (CalendarStack) ---
// TODO: Crear e importar CalendarScreen
// import CalendarScreen from './screens/CalendarScreen';
// TODO: Crear e importar EventCreateEditScreen
// import EventCreateEditScreen from './screens/EventCreateEditScreen';
// TODO: Crear e importar EventDetailScreen
// import EventDetailScreen from './screens/EventDetailScreen';

// --- 6. Pantallas Globales (MainStack) ---
// TODO: Crear e importar SettingsScreen
// import SettingsScreen from './screens/SettingsScreen';
// (ProfileScreen es una pantalla de prueba, la quitamos del flujo final)
// import ProfileScreen from './screens/ProfileScreen';


// --- Inicializamos los Navegadores ---
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const DiaryTabStack = createStackNavigator();
const BlocksTabStack = createStackNavigator();
const CalendarTabStack = createStackNavigator();


// --- Definimos los Stacks de cada Pestaña ---
// (Cada pestaña es un Stack para poder navegar "dentro" de ella)

function DiaryStack() {
  return (
    <DiaryTabStack.Navigator>
      {/* <DiaryTabStack.Screen name="DiaryMain" component={DiaryMainScreen} options={{ title: 'Diario' }} /> */}
      {/* <DiaryTabStack.Screen name="DiaryCreateEntry" component={DiaryCreateEntryScreen} options={{ title: 'Nueva Entrada' }} /> */}
      {/* <DiaryTabStack.Screen name="DiaryStats" component={DiaryStatsScreen} options={{ title: 'Estadísticas' }} /> */}
    </DiaryTabStack.Navigator>
  );
}

function BlocksStack() {
  return (
    <BlocksTabStack.Navigator>
      {/* <BlocksTabStack.Screen name="BlockLibrary" component={BlockLibraryScreen} options={{ title: 'Mis Bloques' }} /> */}
      {/* <BlocksTabStack.Screen name="BlockCreateEdit" component={BlockCreateEditScreen} options={{ title: 'Crear Bloque' }} /> */}
      {/* <BlocksTabStack.Screen name="BlockHistory" component={BlockHistoryScreen} options={{ title: 'Historial' }} /> */}
      {/* <BlocksTabStack.Screen name="Roulette" component={RouletteScreen} options={{ title: 'Ruleta' }} /> */}
    </BlocksTabStack.Navigator>
  );
}

function CalendarStack() {
  return (
    <CalendarTabStack.Navigator>
      {/* <CalendarTabStack.Screen name="CalendarMain" component={CalendarScreen} options={{ title: 'Calendario' }} /> */}
      {/* <CalendarTabStack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Detalle' }} /> */}
    </CalendarTabStack.Navigator>
  );
}

// --- Definimos el Navegador de Pestañas (Bottom Tabs) ---
// Esta es la pantalla "Dashboard" o principal
function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Ocultamos el header del Tab, cada Stack interno lo maneja
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
        tabBarActiveTintColor: '#4F46E5', // Un color de ejemplo
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* <Tab.Screen name="DiaryTab" component={DiaryStack} options={{ title: 'Diario' }} /> */}
      {/* <Tab.Screen name="BlocksTab" component={BlocksStack} options={{ title: 'Bloques' }} /> */}
      {/* <Tab.Screen name="CalendarTab" component={CalendarStack} options={{ title: 'Calendario' }} /> */}
       {/* Pantalla temporal para que la app no crashee, luego la borramos */}
       <Tab.Screen name="Temp" component={WelcomeScreen} options={{ title: 'Temp' }} />
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
          {/* <AuthStack.Screen name="Login" component={LoginScreen} /> */}
          <AuthStack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: true, title: 'Crear Cuenta' }} // Mostramos header aquí
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
          
          {/* Esta pantalla se abre POR ENCIMA de la pestaña de Bloques */}
          {/* <MainStack.Screen name="BlockActive" component={BlockActiveScreen} options={{ presentation: 'modal', title: 'Bloque Activo' }} /> */}
          
          {/* Esta pantalla se abre POR ENCIMA de la pestaña de Calendario */}
          {/* <MainStack.Screen name="EventCreateEdit" component={EventCreateEditScreen} options={{ presentation: 'modal', title: 'Crear Evento' }} /> */}
          
          {/* Esta pantalla se abre POR ENCIMA de todo */}
          {/* <MainStack.Screen name="Settings" component={SettingsScreen} options={{ presentation: 'modal', title: 'Configuración' }} /> */}
        </MainStack.Navigator>
      )}
    </NavigationContainer>
  );
}

// --- Punto de Entrada Principal ---
export default function App() {
  return (
    <AuthProvider>
      <NavigationLayout />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}