import React from 'react';
import { View, Text, StyleSheet, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Contexto y Componentes
import { useAuth } from '../context/AuthContext';
import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';

export default function SettingsScreen() {
  const { signOut, userToken } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", onPress: signOut, style: 'destructive' }
      ]
    );
  };

  return (
    <ScreenContainer style={styles.background}>
      <Text style={styles.screenTitle}>CONFIGURACIÓN</Text>

      {/* Tarjeta de Perfil */}
      <View style={styles.card}>
        <Ionicons name="person-circle-outline" size={60} color="#4B3621" />
        <Text style={styles.userName}>{userToken?.name || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{userToken?.email || 'email@ejemplo.com'}</Text>
      </View>

      {/* Opciones Generales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notificaciones</Text>
          <Switch 
            value={true} 
            trackColor={{ false: "#A68B6E", true: "#4B3621" }}
            thumbColor="#C3B091"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Importar Feriados AR</Text>
          <Switch 
            value={true} 
            trackColor={{ false: "#A68B6E", true: "#4B3621" }}
            thumbColor="#C3B091"
          />
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <CustomButton onPress={handleLogout} style={styles.logoutButton}>
        Cerrar Sesión
      </CustomButton>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: '#C3B091', paddingHorizontal: 20 },
  screenTitle: { fontSize: 20, color: '#000', textAlign: 'center', marginVertical: 20, fontWeight: 'bold' },
  
  card: {
    backgroundColor: '#A68B6E',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3
  },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#000', marginTop: 10 },
  userEmail: { fontSize: 14, color: '#2D2D2D', marginTop: 5 },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#4B3621', marginBottom: 10, marginLeft: 10 },
  
  row: {
    backgroundColor: '#A68B6E',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  rowLabel: { fontSize: 16, color: '#000' },

  logoutButton: { backgroundColor: '#8B0000', borderRadius: 30, height: 55, marginBottom: 20 }
});
