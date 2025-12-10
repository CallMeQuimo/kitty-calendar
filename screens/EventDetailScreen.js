import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { executeSql } from '../db/database';

import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    try {
      const result = await executeSql('SELECT * FROM calendar_events WHERE event_id = ?', [eventId]);
      if (result.rows.length > 0) {
        setEvent(result.rows[0]);
      } else {
        navigation.goBack();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar', '¿Borrar este evento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: async () => {
          await executeSql('DELETE FROM calendar_events WHERE event_id = ?', [eventId]);
          navigation.goBack();
      }}
    ]);
  };

  if (loading) return <ScreenContainer><ActivityIndicator /></ScreenContainer>;
  if (!event) return null;

  // Formateo de fecha
  const dateObj = new Date(event.start_datetime);
  const dateStr = dateObj.toLocaleDateString();
  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <ScreenContainer style={styles.background}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Ionicons 
            name={event.type === 'task' ? "checkbox-outline" : "calendar-outline"} 
            size={40} color="#4B3621" 
          />
          <Text style={styles.typeLabel}>{event.type === 'task' ? 'TAREA' : 'EVENTO'}</Text>
        </View>

        <Text style={styles.eventTitle}>{event.title}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={24} color="#4B3621" />
          <Text style={styles.infoText}>{dateStr} a las {timeStr}</Text>
        </View>

        {/* Espacio para más detalles si los hubiera */}
      </View>

      <View style={{ flex: 1 }} />

      <CustomButton onPress={handleDelete} style={styles.deleteBtn}>
        Eliminar Evento
      </CustomButton>

      <CustomButton onPress={() => navigation.goBack()} style={styles.backBtn}>
        Volver
      </CustomButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: '#C3B091', paddingHorizontal: 20 },
  card: {
    backgroundColor: '#A68B6E', borderRadius: 30, padding: 30, marginTop: 40,
    alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, elevation: 5
  },
  header: { alignItems: 'center', marginBottom: 20 },
  typeLabel: { color: '#4B3621', fontWeight: 'bold', marginTop: 5, letterSpacing: 2 },
  eventTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 30 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 15, width: '100%', justifyContent: 'center' },
  infoText: { fontSize: 18, color: '#000' },
  
  deleteBtn: { backgroundColor: '#8B0000', borderRadius: 30, marginBottom: 15 },
  backBtn: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#4B3621', borderRadius: 30 },
});
