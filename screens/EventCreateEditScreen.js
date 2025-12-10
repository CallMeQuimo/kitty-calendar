import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Asegúrate de que esté instalado
import { executeSql } from '../db/database';

import ScreenContainer from '../components/ScreenContainer';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';

export default function EventCreateEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { preSelectedDate, eventId } = route.params || {};

  const [title, setTitle] = useState('');
  const [isTask, setIsTask] = useState(false); // false = Evento, true = Tarea
  const [date, setDate] = useState(preSelectedDate ? new Date(preSelectedDate) : new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Error', 'Ingresa un título'); return; }

    setLoading(true);
    try {
      // Formato ISO simple: YYYY-MM-DDTHH:mm:ss
      const dateStr = date.toISOString(); 
      const type = isTask ? 'task' : 'event';

      if (eventId) {
        // UPDATE (No implementado en esta vista pero preparado)
      } else {
        await executeSql(
          'INSERT INTO calendar_events (title, type, start_datetime) VALUES (?, ?, ?)',
          [title, type, dateStr]
        );
      }
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <ScreenContainer style={styles.background}>
      <Text style={styles.title}>NUEVO EVENTO</Text>

      <View style={styles.card}>
        <FormField 
          label="Título"
          placeholder="Ej. Dentista, Estudiar..."
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor="#4B3621"
        />

        {/* Selector Tipo */}
        <View style={styles.row}>
          <Text style={styles.label}>¿Es una tarea?</Text>
          <Switch 
            value={isTask} 
            onValueChange={setIsTask}
            trackColor={{ false: "#C3B091", true: "#4B3621" }}
            thumbColor="#fff"
          />
        </View>

        {/* Selector Fecha */}
        <View style={styles.row}>
          <Text style={styles.label}>Fecha y Hora</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateBtn}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString()} - {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      <CustomButton onPress={handleSave} loading={loading} style={styles.saveBtn}>
        Confirmar
      </CustomButton>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: '#C3B091', paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#000', marginVertical: 20, textAlign: 'center' },
  card: { backgroundColor: '#A68B6E', borderRadius: 30, padding: 20, marginBottom: 30 },
  input: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 15, borderWidth: 0, color: '#000' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  label: { fontSize: 16, color: '#000', fontWeight: '500' },
  dateBtn: { backgroundColor: 'rgba(255,255,255,0.3)', padding: 10, borderRadius: 10 },
  dateText: { color: '#000', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#4B3621', borderRadius: 30, height: 55 }
});
