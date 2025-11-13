import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatGraph({ data }) {

  // LÓGICA FUTURA:
  // Aquí procesaríamos el array 'data'
  // para renderizar una gráfica de barras o líneas
  // (ya sea con Views y Styles, o con una librería como 'react-native-svg-charts')

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>
        [Gráfica de Estadísticas de Mood]
      </Text>
      <Text>Datos recibidos: {data ? data.length : 0} puntos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  placeholder: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});
