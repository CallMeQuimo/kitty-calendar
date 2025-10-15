import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Image
            style={styles.logo}
            source={require('../images/kc-logo.png')}
        />

        <Text style={styles.subtitleText}>
            Kitty Calendar
        </Text>
      </View>
      

      

        <CustomButton
          onPress={() => Alert.alert('Hay un skibidi en mi bota!')}
        >
        Boton de prueba funcional
        </CustomButton>

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
    flex: 1,
    backgroundColor: '#C3B091',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 0,
  },
  subtitleText: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '200',
    width: 200,
    textAlign: 'center',
    marginTop: 0
  },
});