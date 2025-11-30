import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configuración básica de español para el calendario
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function CalendarView({ events = [], holidays = [], onDayPress }) {

  // Usamos useMemo para no recalcular los puntos en cada render si los datos no cambian
  const markedDates = useMemo(() => {
    const marks = {};

    // 1. Procesar Feriados (Holidays) - Marcados con fondo o color distintivo
    holidays.forEach(holiday => {
      const dateKey = holiday.date; // Asumiendo formato 'YYYY-MM-DD'
      if (!marks[dateKey]) marks[dateKey] = {};
      
      // Ejemplo: Fondo suave para feriados
      marks[dateKey] = { 
        ...marks[dateKey], 
        selected: true, 
        selectedColor: '#FFD700', // Dorado para feriados
        selectedTextColor: '#000000'
      };
    });

    // 2. Procesar Eventos (Calendar Events) - Puntos (Dots)
    events.forEach(event => {
      // Extraer solo la parte YYYY-MM-DD del datetime
      const dateKey = event.start_datetime.split('T')[0].split(' ')[0];

      if (!marks[dateKey]) marks[dateKey] = {};

      // Si ya hay dots, agregamos, si no, inicializamos array
      const existingDots = marks[dateKey].dots || [];
      
      // Definir color según tipo de evento (opcional, por ahora default azul)
      const dotColor = event.type === 'task' ? '#10B981' : '#2563EB'; // Verde tareas, Azul eventos

      marks[dateKey] = {
        ...marks[dateKey],
        dots: [...existingDots, { key: event.event_id, color: dotColor }],
        // Habilitamos el marcado de puntos
        marked: true 
      };
    });

    return marks;
  }, [events, holidays]);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        markingType={'multi-dot'} // Permite múltiples puntos por día
        monthFormat={'MMMM yyyy'}
        firstDay={1} // Semana empieza en Lunes
        theme={{
          todayTextColor: '#2563EB',
          arrowColor: '#2563EB',
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '500',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Eliminamos flex: 1 para que se ajuste a su contenido y no rompa layouts en ScrollView
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    elevation: 2, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
