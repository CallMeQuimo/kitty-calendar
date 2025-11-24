import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/CustomButton';

// 1. Aceptamos la prop "navigation" que nos pasa el Stack Navigator
export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.topContainer}>
          <Image
            style={styles.logo}
            source={require('../images/kc-logo.png')}
          />
          <Text style={styles.titleText}>Kitty Calendar</Text>
        </View>

        <View style={styles.bottomContainer}>
          {/* 2. Reemplazamos Alert con navigation.navigate() */}
          <CustomButton
            onPress={() => navigation.navigate('Login')} // Navega a Login
            style={styles.button}
          >
            Ir a Login (Próximamente)
          </CustomButton>

          {/* 3. Reemplazamos Alert con navigation.navigate() */}
          <CustomButton
            onPress={() => navigation.navigate('Signup')} // Navega a Signup
            style={styles.button}
          >
            Ir a Signup (Test)
          </CustomButton>

          {/* 4. Botón de DEBUG para ver ProfileScreen */}
          <CustomButton
            onPress={() => navigation.navigate('Profile')} // Navega a Profile
            style={[styles.button, styles.debugButton]}
          >
            Ir a Profile (Test API)
          </CustomButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3B091',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    height: '80%',
    width: '80%',
    backgroundColor: '#9A724A',
    borderRadius: 30,
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    gap: 16,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 30,
    color: '#000000',
    fontWeight: 'normal',
    width: '80%',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '70%',
    backgroundColor: '#000000',
  },
  // Estilo simple para el botón de debug
  debugButton: {
    backgroundColor: '#555',
    borderColor: '#fff',
    borderWidth: 1,
  },
});
