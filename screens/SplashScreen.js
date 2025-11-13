import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      
      <Image
        style={styles.logo}
        source={require('../images/kc-logo.png')}
      />

      <Text style={styles.titleText}>
        Kitty Calendar
      </Text>
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
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  titleText: {
    fontSize: 48,
    color: '#3d3d3d',
    fontWeight: '300',
    width: 200,
    textAlign: 'center',
  },
});
