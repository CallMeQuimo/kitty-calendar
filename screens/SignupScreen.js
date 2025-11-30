import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Dependencias
import { executeSql } from '../db/database';
import { useAuth } from '../context/AuthContext';

// Componentes Reutilizables
import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';
import FormField from '../components/FormField';

export default function SignupScreen() {
  const navigation = useNavigation();
  const { signUp } = useAuth(); // Usamos la función del contexto para actualizar el estado global

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados de control
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Objeto para manejar errores por campo

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validar Email
    if (!email) {
      newErrors.email = 'El correo es obligatorio';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo válido';
      isValid = false;
    }

    // Validar Contraseña
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
      isValid = false;
    }

    // Validar Confirmación
    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. Verificar si el usuario ya existe
      const checkUserSql = 'SELECT user_id FROM users WHERE email = ? LIMIT 1';
      const checkResult = await executeSql(checkUserSql, [email.toLowerCase()]);

      if (checkResult.rows.length > 0) {
        setErrors({ email: 'Este correo ya está registrado' });
        setLoading(false);
        return;
      }

      // 2. Insertar nuevo usuario
      // NOTA: En producción, la contraseña SIEMPRE debe hashearse.
      // Como esto es un MVP local escolar, la guardamos texto plano por ahora.
      const insertSql = `
        INSERT INTO users (email, password, created_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `;
      await executeSql(insertSql, [email.toLowerCase(), password]);

      // 3. Iniciar sesión en la app
      // Esto actualizará el AuthContext y redirigirá al Dashboard automáticamente
      await signUp(); 

    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error', 'Hubo un problema al crear tu cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Título */}
          <Text style={styles.title}>Kitty Calendar</Text>

          <View style={styles.formContainer}>
            {/* Campo: Correo */}
            <FormField
              label="Introduzca su correo electrónico"
              placeholder="correo electrónico"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: null })); // Limpiar error al escribir
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            {/* Campo: Contraseña */}
            <FormField
              label="Introduzca su contraseña"
              placeholder="contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: null }));
              }}
              secureTextEntry
              error={errors.password}
            />

            {/* Campo: Confirmar Contraseña */}
            <FormField
              label="introduzca su contraseña de nuevo"
              placeholder="contraseña"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              secureTextEntry
              error={errors.confirmPassword}
            />

            {/* Botón: Continuar */}
            <CustomButton 
              onPress={handleRegister} 
              loading={loading}
              style={styles.continueButton} // Sobrescribimos estilo para que sea NEGRO
            >
              Continuar
            </CustomButton>

            {/* Enlace para volver al login (opcional pero recomendado) */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
              <Text 
                style={styles.loginLink} 
                onPress={() => navigation.navigate('Login')}
              >
                Inicia sesión
              </Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    // ScreenContainer ya tiene flex: 1 y bg blanco
    // Si quisieras el color del diseño Figma, podrías agregarlo aquí:
    // backgroundColor: '#B08E6C', 
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#000', // Texto oscuro
  },
  formContainer: {
    width: '100%',
  },
  continueButton: {
    backgroundColor: '#000000', // Negro según diseño Figma
    marginTop: 20,
    borderRadius: 8, // Ligeramente menos redondeado que el default si se desea
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    color: '#000',
    fontWeight: 'bold',
  },
});
