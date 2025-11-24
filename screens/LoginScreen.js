import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

// Importamos nuestros componentes reutilizables
import ScreenContainer from '../components/ScreenContainer';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';

// Importamos el hook de autenticación
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (email.length === 0 || password.length === 0) {
      Alert.alert('Campo vacío', 'Por favor completa todos los campos.');
      return;
    }

    setLocalLoading(true);
    try {
      await signIn(); 
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión.');
      setLocalLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.background}>
      {/* Tarjeta central Marrón (Igual que en WelcomeScreen) */}
      <View style={styles.card}>
        
        {/* Título */}
        <Text style={styles.title}>Kitty Calendar</Text>

        <View style={styles.formContainer}>
          {/* Input Correo */}
          <FormField
            label="Introduzca su correo electrónico"
            placeholder="correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            // Pasamos estilos personalizados para sobreescribir los default
            style={styles.input} 
            labelStyle={styles.label}
          />

          {/* Input Contraseña */}
          <FormField
            label="Introduzca su contraseña"
            placeholder="contraseña"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            labelStyle={styles.label}
          />

          {/* Botón Negro "Continuar" */}
          <CustomButton 
            onPress={handleLogin} 
            loading={localLoading}
            style={styles.loginButton}
          >
            Continuar
          </CustomButton>
        </View>

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C3B091', // Beige de fondo
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0, // Quitamos padding del container para manejarlo nosotros
  },
  card: {
    backgroundColor: '#9A724A', // Marrón oscuro de la tarjeta
    width: '80%',
    borderRadius: 30, // Bordes muy redondeados como en la imagen
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 15, // Espacio vertical entre elementos
  },
  formfield: {
    width: '10%',
    backgroundColor: 'red',
  },
  // Estilos para sobreescribir FormField
  label: {
    color: '#000000', // Texto negro para "Introduzca su..."
    fontSize: 14,
    marginBottom: 6,
    fontWeight: 'normal',
  },
  input: {
    backgroundColor: '#FFFFFF', // Fondo blanco puro
    borderRadius: 10,
    borderWidth: 0, // Sin borde gris
    paddingHorizontal: 15,
    height: 45, // Altura fija cómoda
    width: 200,
  },
  loginButton: {
    backgroundColor: '#000000', // Botón Negro
    borderRadius: 10,
    marginTop: 30, // Separación grande antes del botón
    height: 50,
  },
});
