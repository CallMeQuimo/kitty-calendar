import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Alert } from 'react-native';

import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import TextInputSimple from '../components/InputTextoSimple';

export default function InicioCuenta({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Perfil" />

      <View style={styles.blank}>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  blank: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  hint: {
    marginBottom: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
