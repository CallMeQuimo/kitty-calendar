import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { initDatabase } from './db/database';

// --- Contexto ---
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Pantallas ---
// - AuthStack
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';

// - MainStack (Globales)
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen'; // ✅ NUEVA

// -- Tabs
// - Blocks Tab
import BlockLibraryScreen from './screens/BlockLibraryScreen';
import BlockCreateEditScreen from './screens/BlockCreateEditScreen';
import BlockActiveScreen from './screens/BlockActiveScreen';
import BlockHistoryScreen from './screens/BlockHistoryScreen'; // ✅ NUEVA
import RouletteScreen from './screens/RouletteScreen';

// - Calendar Tab
import CalendarScreen from './screens/CalendarScreen';
import EventCreateEditScreen from './screens/EventCreateEditScreen'; // ✅ NUEVA
import EventDetailScreen from './screens/EventDetailScreen'; // ✅ NUEVA

// - Diary Tab
import DiaryMainScreen from './screens/DiaryMainScreen'; // ✅ NUEVA
import DiaryCreateEntryScreen from './screens/DiaryCreateEntryScreen'; // ✅ NUEVA
import DiaryStatsScreen from './screens/DiaryStatsScreen';


// --- Navegadores ---
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const DiaryTabStack = createStackNavigator();
const BlocksTabStack = createStackNavigator();
const CalendarTabStack = createStackNavigator();

// --- Stacks Secundarios ---
function DiaryStack() {
  return (
    <DiaryTabStack.Navigator>
      <DiaryTabStack.Screen 
        name="DiaryMain" 
        component={DiaryMainScreen} 
        options={{ title: 'Mi Diario', headerShown: false }} 
      />
      <DiaryTabStack.Screen 
        name="DiaryCreateEntry" 
        component={DiaryCreateEntryScreen} 
        options={{ title: 'Nueva Entrada' }} 
      />
      <DiaryTabStack.Screen 
        name="DiaryStats" 
        component={DiaryStatsScreen} 
        options={{ headerShown: false }} 
      />
    </DiaryTabStack.Navigator>
  );
}


function BlocksStack() {
  return (
    <BlocksTabStack.Navigator>
      <BlocksTabStack.Screen 
        name="BlockLibrary" 
        component={BlockLibraryScreen} 
        options={{ title: 'Mis Bloques' }} 
      />
      <BlocksTabStack.Screen 
        name="BlockCreateEdit" 
        component={BlockCreateEditScreen} 
        options={{ title: 'Gestionar Bloque' }} 
      />
      <BlocksTabStack.Screen 
        name="Roulette" 
        component={RouletteScreen} 
        options={{ headerShown: false }} 
      />
      <BlocksTabStack.Screen 
        name="BlockActive" 
        component={BlockActiveScreen} 
        options={{ title: 'En Progreso', headerShown: false }} 
      />
      <BlocksTabStack.Screen 
        name="BlockHistory" 
        component={BlockHistoryScreen} 
        options={{ title: 'Historial' }} 
      />
    </BlocksTabStack.Navigator>
  );
}

function CalendarStack() {
  return (
    <CalendarTabStack.Navigator>
       <CalendarTabStack.Screen 
         name="CalendarScreen" 
         component={CalendarScreen} 
         options={{ headerShown: false }}
       />
       <CalendarTabStack.Screen 
         name="EventCreateEdit" 
         component={EventCreateEditScreen} 
         options={{ title: 'Gestionar Evento' }} 
       />
       <CalendarTabStack.Screen 
         name="EventDetail" 
         component={EventDetailScreen} 
         options={{ title: 'Detalle del Evento' }} 
       />
    </CalendarTabStack.Navigator>
  );
}

// --- Tabs Principales ---
function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'DiaryTab') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'BlocksTab') iconName = focused ? 'layers' : 'layers-outline';
          else if (route.name === 'CalendarTab') iconName = focused ? 'calendar' : 'calendar-outline';
          return <Ionicons name={iconName || 'ellipse'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="DiaryTab" component={DiaryStack} options={{ title: 'Diario' }} />
      <Tab.Screen name="BlocksTab" component={BlocksStack} options={{ title: 'Bloques' }} />
      <Tab.Screen name="CalendarTab" component={CalendarStack} options={{ title: 'Calendario' }} />
    </Tab.Navigator>
  );
}

// --- Layout de Navegación ---
function NavigationLayout() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {userToken == null ? (
        // Stack No Autenticado
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: true, title: 'Crear Cuenta' }} />
        </AuthStack.Navigator>
      ) : (
        // Stack Autenticado
        <MainStack.Navigator>
          {/* DashboardTabs contiene los 3 Tabs principales */}
          <MainStack.Screen name="Dashboard" component={DashboardTabs} options={{ headerShown: false }} />
          
          {/* Pantallas globales fuera de los tabs (como Settings) */}
          <MainStack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Configuración' }} 
          />
        </MainStack.Navigator>
      )}
    </NavigationContainer>
  );
}

// --- App Principal ---
export default function App() {
  // Estado para controlar si la BD ya inició
  const [isDbReady, setDbReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // 1. Iniciamos la BD y esperamos a que termine
        await initDatabase();
        console.log('Base de datos lista para usarse');
      } catch (e) {
        console.warn('Error iniciando BD:', e);
      } finally {
        // 2. Marcamos como lista para renderizar el resto de la app
        setDbReady(true);
      }
    };

    prepareApp();
  }, []);

  if (!isDbReady) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <NavigationLayout />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
