import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Base de datos y Utilidades
import { executeSql } from '../db/database';

// Componentes
import ScreenContainer from '../components/ScreenContainer';
import CalendarView from '../components/CalendarView';
import CustomButton from '../components/CustomButton';

// Componente interno para la "Agenda del Día"
const AgendaItem = ({ item, onPress }) => {
    let iconName = 'ellipse';
    // Para que contraste bien dentro del bloque marrón, usaremos íconos claros u oscuros
    // pero manteniendo consistencia.
    let iconColor = '#4B3621'; 
    
    if (item.type === 'holiday') {
        iconName = 'flag';
        iconColor = '#FFD700'; // Dorado
    } else if (item.type === 'task') {
        iconName = 'checkbox-outline';
        iconColor = '#fff'; 
    } else if (item.type === 'event') {
        iconName = 'time-outline';
        iconColor = '#fff';
    }

    return (
        <TouchableOpacity style={styles.agendaItem} onPress={onPress}>
            <View style={styles.agendaContent}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Ionicons name={iconName} size={18} color={iconColor} />
                    <Text style={styles.agendaTitle}>{item.title || item.name}</Text>
                </View>
                {item.time && <Text style={styles.agendaTime}>{item.time}</Text>}
                {item.type === 'holiday' && <Text style={styles.agendaSubtitle}>Feriado</Text>}
            </View>
        </TouchableOpacity>
    );
};

export default function CalendarScreen() {
  const navigation = useNavigation();
  
  // Datos
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  
  // Selección
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchCalendarData();
    }, [])
  );

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const eventsRes = await executeSql('SELECT * FROM calendar_events');
      const loadedEvents = eventsRes.rows;

      const holidaysRes = await executeSql('SELECT * FROM holidays');
      const loadedHolidays = holidaysRes.rows;

      setEvents(loadedEvents);
      setHolidays(loadedHolidays);

      filterEventsForDay(selectedDate, loadedEvents, loadedHolidays);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar el calendario');
    } finally {
      setLoading(false);
    }
  };

  const filterEventsForDay = (dateStr, currentEvents, currentHolidays) => {
    const dayEvents = currentEvents.filter(e => e.start_datetime.startsWith(dateStr)).map(e => ({
        ...e,
        time: e.start_datetime.split(' ')[1] || e.start_datetime.split('T')[1]?.substring(0,5),
        originalType: e.type 
    }));

    const dayHolidays = currentHolidays.filter(h => h.date === dateStr).map(h => ({
        ...h,
        title: h.name, 
        type: 'holiday'
    }));

    setSelectedDayEvents([...dayHolidays, ...dayEvents]);
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    filterEventsForDay(day.dateString, events, holidays);
  };

  const handleEventPress = (item) => {
      if (item.type === 'holiday') return; 
      navigation.navigate('EventDetail', { eventId: item.event_id });
  };

  const handleCreateEvent = () => {
      navigation.navigate('EventCreateEdit', { preSelectedDate: selectedDate });
  };

  return (
    <ScreenContainer style={styles.background}>
        
        {/* Título Superior */}
        <Text style={styles.screenTitle}>CALENDARIO</Text>

        {/* --- Bloque 1: Calendario Mensual --- */}
        <View style={styles.calendarBlock}>
            {/* NOTA: El CalendarView original tiene fondo blanco. 
               Al estar dentro de este bloque, se verá como una "tarjeta" dentro del bloque marrón.
               Visualmente separa bien la grilla del fondo.
            */}
            <Text style={styles.blockLabel}>Calendario mensual</Text>
            <View style={styles.calendarInnerContainer}>
                <CalendarView 
                    events={events} 
                    holidays={holidays} 
                    onDayPress={handleDayPress} 
                />
            </View>
        </View>

        {/* --- Bloque 2: Botón Agregar --- */}
        {/* Usamos un contenedor View para darle el margen exacto del diseño */}
        <View style={styles.buttonContainer}>
            <CustomButton 
                onPress={handleCreateEvent} 
                style={styles.brownPillButton}
            >
                Agregar evento
            </CustomButton>
        </View>

        {/* --- Bloque 3: Eventos del día --- */}
        <View style={[styles.agendaBlock, { flex: 1 }]}>
            <Text style={styles.blockLabel}>Eventos del dia</Text>
            
            <FlatList
                data={selectedDayEvents}
                keyExtractor={(item, index) => (item.event_id || item.holiday_id || index).toString()}
                renderItem={({ item }) => <AgendaItem item={item} onPress={() => handleEventPress(item)} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nada programado para hoy</Text>
                }
            />
        </View>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C3B091', // Beige Fondo
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 0,
  },
  screenTitle: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Estilo Base de los Bloques Marrones
  calendarBlock: {
    backgroundColor: '#A68B6E', // Marrón medio
    borderRadius: 30, // Bordes muy redondeados (estilo Figma)
    padding: 15,
    marginBottom: 20,
    // Sombra sutil
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  calendarInnerContainer: {
    borderRadius: 15,
    overflow: 'hidden', // Para que el calendario blanco no se salga de bordes si los tuviera
    marginTop: 10,
  },
  
  // Botón Central
  buttonContainer: {
    marginBottom: 20,
  },
  brownPillButton: {
    backgroundColor: '#A68B6E',
    borderRadius: 30, // Forma de píldora completa
    height: 55,
  },

  // Bloque Agenda
  agendaBlock: {
    backgroundColor: '#A68B6E',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // Si quieres que llegue hasta abajo de la pantalla:
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0,
    padding: 20,
    paddingBottom: 0, // El FlatList maneja el padding inferior
  },
  
  // Textos dentro de los bloques
  blockLabel: {
    color: '#2D2D2D', // Texto oscuro casi negro
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '400',
  },
  
  // Lista de Agenda
  listContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#4B3621',
    marginTop: 20,
    fontStyle: 'italic',
    opacity: 0.7,
  },

  // Items individuales de la agenda (dentro del bloque marrón)
  agendaItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 54, 33, 0.2)', // Línea separadora sutil
    paddingVertical: 12,
  },
  agendaContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agendaTitle: {
    color: '#000',
    fontSize: 16,
  },
  agendaTime: {
    color: '#2D2D2D',
    fontWeight: 'bold',
  },
  agendaSubtitle: {
    fontSize: 12,
    color: '#FFD700',
  }
});
