import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Contexto para Logout
import { useAuth } from '../context/AuthContext';

// Componente Interno: Botón Grande de Módulo
const ModuleCard = ({ title, onPress }) => (
  <TouchableOpacity 
    style={styles.moduleCard} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.moduleText}>{title}</Text>
  </TouchableOpacity>
);

export default function DashboardScreen({ navigation }) {
  const { signOut } = useAuth();

  const handleConfigPress = () => {
    // Aquí podrías ir a una pantalla de Settings real.
    // Por ahora, ofrecemos cerrar sesión como acción principal.
    Alert.alert(
      "Configuración",
      "Opciones de cuenta",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: 'destructive',
          onPress: () => signOut()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- HEADER --- */}
      <View style={styles.headerRow}>
        {/* Logo/Icono Izquierda */}
        <View style={styles.logoPlaceholder}>
            {/* Si tienes una imagen de logo, usa <Image /> aquí. */}
            <Ionicons name="paw" size={24} color="#000" />
        </View>

        {/* Título Central */}
        <Text style={styles.headerTitle}>Kitty Calendar</Text>

        {/* Botón Configuración Derecha */}
        <TouchableOpacity onPress={handleConfigPress}>
            <Text style={styles.configText}>Config.</Text>
        </TouchableOpacity>
      </View>

      {/* --- BODY: BOTONES GIGANTES --- */}
      <View style={styles.modulesContainer}>
        
        {/* 1. Diario */}
        <ModuleCard 
          title="Diario" 
          onPress={() => navigation.navigate('DiaryTab')} 
        />

        {/* 2. Organizador (Bloques) */}
        <ModuleCard 
          title="Organizador" 
          onPress={() => navigation.navigate('BlocksTab')} 
        />

        {/* 3. Calendario */}
        <ModuleCard 
          title="Calendario" 
          onPress={() => navigation.navigate('CalendarTab')} 
        />

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3B091', // Fondo Beige (Figma)
  },
  
  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#A68B6E', // Cabecera marrón oscuro (según imagen Figma dashboard)
  },
  logoPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  configText: {
    fontSize: 16,
    color: '#000',
    textDecorationLine: 'underline',
  },

  // Contenedor de Módulos
  modulesContainer: {
    flex: 1,
    paddingHorizontal: 30, // Márgenes laterales amplios para centrar las tarjetas
    justifyContent: 'center',
    gap: 30, // Espacio vertical entre tarjetas
    paddingBottom: 50, // Un poco de aire abajo
  },

  // Tarjeta de Módulo
  moduleCard: {
    backgroundColor: '#A68B6E', // Marrón Medio
    height: 120, // Altura considerable
    borderRadius: 30, // Bordes muy redondeados
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  moduleText: {
    fontSize: 20,
    color: '#000', // Texto negro
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});