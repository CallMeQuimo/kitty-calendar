import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputTextoSimple from './InputTextoSimple';

export default function FormField({ label, error, ...textInputProps }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <InputTextoSimple {...textInputProps} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444', // Rojo para error
    marginTop: 4,
  },
});
