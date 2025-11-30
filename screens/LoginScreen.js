import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

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

  // Obtenemos la función signIn real del contexto actualizado
  const { signIn } = useAuth();

  const handleLogin = async () => {
    // 1. Validación básica
    if (email.length === 0 || password.length === 0) {
      Alert.alert('Campos vacíos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLocalLoading(true);
    try {
      // 2. Intentamos iniciar sesión con la BD
      await signIn(email, password);
      // Si tiene éxito, el AuthContext actualiza el estado 'userToken' 
      // y la navegación (NavigationLayout en App.js) cambiará automáticamente al Dashboard.
    } catch (error) {
      // 3. Manejo de errores (Credenciales inválidas)
      Alert.alert('Error de acceso', 'El correo o la contraseña son incorrectos.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.background}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}
          showsVerticalScrollIndicator={false}
        >
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
              
              {/* Enlace rápido para registro (Opcional, mejora UX) */}
              <Text 
                style={styles.registerLink}
                onPress={() => navigation.navigate('Signup')}
              >
                ¿No tienes cuenta? Regístrate
              </Text>

            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C3B091', // Beige de fondo
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0, 
  },
  card: {
    backgroundColor: '#9A724A', // Marrón oscuro de la tarjeta
    width: '85%',
    borderRadius: 30, // Bordes muy redondeados
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
  // Estilos para sobreescribir FormField
  label: {
    color: '#000000', // Texto negro
    fontSize: 14,
    marginBottom: 6,
    fontWeight: 'normal',
  },
  input: {
    backgroundColor: '#FFFFFF', // Fondo blanco puro
    borderRadius: 10,
    borderWidth: 0, // Sin borde gris
    paddingHorizontal: 15,
    height: 45, 
    width: '100%', // Asegura que llene el contenedor padre
  },
  loginButton: {
    backgroundColor: '#000000', // Botón Negro
    borderRadius: 10,
    marginTop: 20, 
    height: 50,
  },
  registerLink: {
    marginTop: 15,
    color: '#000', // Negro o blanco según contraste deseado (negro se ve bien sobre marrón)
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});
