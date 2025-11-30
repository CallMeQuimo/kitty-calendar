import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

// Importamos componentes
import ScreenContainer from '../components/ScreenContainer';
import DashboardButton from '../components/DashboardButton';
import CustomButton from '../components/CustomButton'; // Para el botón de Logout

// Importamos el contexto para poder cerrar sesión
import { useAuth } from '../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: 'destructive',
          onPress: () => signOut() // Esto nos devolverá al Login automáticamente
        }
      ]
    );
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola!</Text>
        <Text style={styles.subtitle}>¿Qué quieres hacer hoy?</Text>
      </View>

      <View style={styles.menuContainer}>
        {/* Botones de los Módulos (Por ahora solo visuales) */}
        <DashboardButton 
          title="Mi Diario" 
          iconName="book" 
          onPress={() => Alert.alert("Próximamente", "Aquí iría al Stack de Diario")}
        />
        
        <DashboardButton 
          title="Mis Bloques" 
          iconName="layers" 
          onPress={() => Alert.alert("Próximamente", "Aquí iría al Stack de Bloques")}
        />

        <DashboardButton 
          title="Calendario" 
          iconName="calendar" 
          onPress={() => Alert.alert("Próximamente", "Aquí iría al Stack de Calendario")}
        />
      </View>

      <View style={styles.footer}>
        <CustomButton 
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Cerrar Sesión
        </CustomButton>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6', // Gris muy suave
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 5,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center', // Centra los botones verticalmente
  },
  footer: {
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#EF4444', // Rojo para salir
  }
});
