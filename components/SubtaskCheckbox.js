import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox'; // Importamos el checkbox

export default function SubtaskCheckbox({ label, value, onToggle }) {
  return (
    // Usamos Pressable para que se pueda clickear en el texto también
    <Pressable onPress={onToggle} style={styles.container}>
      <Checkbox
        style={styles.checkbox}
        value={value}
        onValueChange={onToggle}
        color={value ? '#4F46E5' : undefined}
      />
      <Text style={[styles.label, value && styles.labelDone]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    flex: 1, // Para que el texto se ajuste
  },
  labelDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
});
