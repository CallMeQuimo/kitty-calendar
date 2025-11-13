import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// 1. Crear el Contexto
// El valor default (null) se usa cuando no hay un Provider
const AuthContext = createContext(null);

// 2. Crear el Proveedor (Provider)
// Este componente envolverá nuestra app y proveerá el estado de auth
export const AuthProvider = ({ children }) => {
  // Estado para saber si el usuario está logueado o no
  const [userToken, setUserToken] = useState(null);
  // Estado para mostrar un "loading" mientras chequeamos si ya estaba logueado
  const [isLoading, setIsLoading] = useState(true);

  // Simulación de chequeo de token al iniciar la app
  useEffect(() => {
    // Aquí iría la lógica para chequear si hay un token guardado en el dispositivo
    // (ej. usando AsyncStorage o SecureStore).
    // Como es una simulación, solo esperamos 1 segundo.
    setTimeout(() => {
      setIsLoading(false);
      // setUserToken('dummy-token'); // Descomenta esta línea para simular que YA ESTABAS logueado
    }, 1500); // 1.5 segundos de SplashScreen
  }, []);

  // Las funciones que la app podrá usar para cambiar el estado
  // Usamos useMemo para evitar que estas funciones se re-creen en cada render
  const authContextValue = useMemo(
    () => ({
      // Función para iniciar sesión (simulada)
      signIn: async () => {
        // Lógica de login... (llamar a API, guardar token, etc.)
        // Por ahora, solo simulamos que encontramos un token
        setIsLoading(true);
        setTimeout(() => {
          setUserToken('un-token-falso');
          setIsLoading(false);
        }, 1000);
      },
      // Función para cerrar sesión (simulada)
      signOut: async () => {
        setIsLoading(true);
        setTimeout(() => {
          setUserToken(null);
          setIsLoading(false);
        }, 500);
      },
      // Función para registrarse (simulada)
      signUp: async () => {
        // Lógica de registro...
        setIsLoading(true);
        setTimeout(() => {
          setUserToken('un-token-falso-de-registro');
          setIsLoading(false);
        }, 1000);
      },
      // El token del usuario. Si es `null`, no está logueado.
      userToken,
      // El estado de carga (para el SplashScreen)
      isLoading,
    }),
    [userToken, isLoading] // Estas dependencias aseguran que el valor se actualice
  );

  // Mostramos un spinner de carga si la app está en "isLoading"
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Si no está cargando, proveemos el contexto a los hijos (la app)
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Crear el Hook personalizado
// Esto facilita que cualquier pantalla use el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Estilos para el contenedor de carga
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // O el color de tu SplashScreen
  },
});