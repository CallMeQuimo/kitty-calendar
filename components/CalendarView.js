import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars'; // Importamos la librería

export default function CalendarView({ events, holidays, onDayPress }) {
  
  // LÓGICA FUTURA:
  // Aquí procesaríamos los 'events' y 'holidays'
  // para convertirlos al formato que 'Calendar' espera en la prop 'markedDates'
  // Por ej: { '2025-11-20': { marked: true, dotColor: 'blue' } }

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        // markedDates={{}} // Aquí irían los marcadores
        monthFormat={'MMMM yyyy'}
        // Configuración para español (la librería es en inglés por defecto)
        // Se puede configurar con 'react-native-calendars/src/services/locales'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
