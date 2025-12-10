// components/FormField.js actualizado
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputTextoSimple from './InputTextoSimple';

// Agregamos 'labelStyle' a los props recibidos
export default function FormField({ label, error, labelStyle, containerStyle, ...textInputProps }) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        // Ahora combinamos el estilo base con el que tú le pases
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
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
    color: '#374151', // Gris oscuro por defecto
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});
