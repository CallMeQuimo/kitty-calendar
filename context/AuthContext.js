import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { executeSql } from '../db/database'; // Importamos el ejecutor SQL

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null); // Aquí guardaremos el objeto usuario entero (id, email, name)
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. Cargar sesión persistente al iniciar la app ---
  useEffect(() => {
    const loadSession = async () => {
      try {
        // Buscamos si hay una sesión guardada en la tabla 'settings'
        const result = await executeSql("SELECT value FROM settings WHERE key = 'user_session' LIMIT 1");
        
        if (result.rows.length > 0) {
          const userData = JSON.parse(result.rows[0].value);
          setUserToken(userData);
        }
      } catch (error) {
        console.log('No se encontró sesión activa o error al cargar:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  // --- Funciones de Autenticación ---

  const authActions = useMemo(() => ({
    
    // A) INICIAR SESIÓN
    signIn: async (email, password) => {
      setIsLoading(true);
      try {
        // 1. Buscar usuario en la BD
        const sql = "SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1";
        // Nota: En producción, 'password' debería compararse con hash, aquí es texto plano por el MVP escolar
        const result = await executeSql(sql, [email.toLowerCase(), password]);

        if (result.rows.length > 0) {
          const user = result.rows[0];
          
          // 2. Guardar sesión en la tabla 'settings' para persistencia
          await executeSql(
            "INSERT OR REPLACE INTO settings (key, value) VALUES ('user_session', ?)", 
            [JSON.stringify(user)]
          );

          // 3. Actualizar estado de la app
          setUserToken(user); 
        } else {
          throw new Error('Credenciales incorrectas');
        }
      } catch (error) {
        console.error('Login error:', error);
        throw error; // Re-lanzamos el error para que la pantalla lo maneje (muestre alerta)
      } finally {
        setIsLoading(false);
      }
    },

    // B) CERRAR SESIÓN
    signOut: async () => {
      setIsLoading(true);
      try {
        // Borramos la sesión de la tabla 'settings'
        await executeSql("DELETE FROM settings WHERE key = 'user_session'");
        setUserToken(null);
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setIsLoading(false);
      }
    },

    // C) REGISTRARSE (Post-Creación)
    // Esta función se llama DESPUÉS de haber insertado el usuario en SignupScreen
    signUp: async () => {
      setIsLoading(true);
      try {
        // Obtenemos el último usuario creado (el que se acaba de registrar)
        const sql = "SELECT * FROM users ORDER BY created_at DESC LIMIT 1";
        const result = await executeSql(sql);

        if (result.rows.length > 0) {
          const user = result.rows[0];
          // Guardamos sesión y actualizamos estado
          await executeSql(
            "INSERT OR REPLACE INTO settings (key, value) VALUES ('user_session', ?)", 
            [JSON.stringify(user)]
          );
          setUserToken(user);
        }
      } catch (error) {
        console.error('Auto-login error:', error);
      } finally {
        setIsLoading(false);
      }
    },

    userToken, // Contiene info del usuario: { user_id: 1, email: '...', ... }
    isLoading,
  }), [userToken, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authActions}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
