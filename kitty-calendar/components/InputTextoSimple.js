import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function TextInputSimple(props) {
  return <TextInput style={[styles.input, props.style]} placeholderTextColor="#9ca3af" {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 14,
  },
});
