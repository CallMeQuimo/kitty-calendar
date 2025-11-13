import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.topContainer}>
            <Image
            style={styles.logo}
            source={require('../images/kc-logo.png')}
            />
            <Text style={styles.titleText}>
            Kitty Calendar
            </Text>
        </View>
      
        <View style={styles.bottomContainer}>
            <CustomButton
            onPress={() => Alert.alert('Inicio de Sesión', 'Aquí va la lógica de login!')}
            style={styles.button}
            >
              Inicie sesión
            </CustomButton>

            <CustomButton
            onPress={() => Alert.alert('Registro', 'Aquí va la lógica de registro!')}
            style={styles.button}
            >
            Cree una cuenta
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
    alignItems: 'center'
  },
  subContainer: {
    height: '80%',
    width: '80%',
    backgroundColor: '#9A724A',
    borderRadius: 30
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
  }
});
