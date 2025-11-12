import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Esto es lo mínimo para que sea un "React Component" válido
export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Esta es la pantalla de Registro (Signup).</Text>
      <Text style={styles.subtitle}>Pronto aquí irá un formulario.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff', // Fondo blanco para que se vea bien
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});