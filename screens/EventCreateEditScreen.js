import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { executeSql } from '../db/database';

import ScreenContainer from '../components/ScreenContainer';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';

export default function EventCreateEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { preSelectedDate, eventId } = route.params || {};

  const [title, setTitle] = useState('');
  const [isTask, setIsTask] = useState(false);
  
  // Manejo de fecha y hora
  const [date, setDate] = useState(preSelectedDate ? new Date(preSelectedDate) : new Date());
  const [mode, setMode] = useState('date'); // 'date' o 'time'
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const onDateChange = (event, selectedDate) => {
    // En Android, el picker se cierra al seleccionar
    setShow(Platform.OS === 'ios'); 
    
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Error', 'Ingresa un título'); return; }

    setLoading(true);
    try {
      // Ajuste para zona horaria local (simple)
      // Construimos ISO string preservando la hora local seleccionada
      const offset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date - offset)).toISOString().slice(0, -1);
      
      const type = isTask ? 'task' : 'event';

      if (eventId) {
        // Lógica de update si fuera necesario
      } else {
        await executeSql(
          'INSERT INTO calendar_events (title, type, start_datetime) VALUES (?, ?, ?)',
          [title, type, localISOTime]
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

        <View style={styles.row}>
          <Text style={styles.label}>¿Es una tarea?</Text>
          <Switch 
            value={isTask} 
            onValueChange={setIsTask}
            trackColor={{ false: "#C3B091", true: "#4B3621" }}
            thumbColor="#fff"
          />
        </View>

        {/* Botones separados para Fecha y Hora */}
        <View style={styles.dateTimeRow}>
            <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.labelMini}>Fecha</Text>
                <TouchableOpacity onPress={() => showMode('date')} style={styles.dateBtn}>
                    <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
                <Text style={styles.labelMini}>Hora</Text>
                <TouchableOpacity onPress={() => showMode('time')} style={styles.dateBtn}>
                    <Text style={styles.dateText}>
                        {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
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
  dateTimeRow: { flexDirection: 'row', marginTop: 20 },
  label: { fontSize: 16, color: '#000', fontWeight: '500' },
  labelMini: { fontSize: 12, color: '#2D2D2D', marginBottom: 5 },
  dateBtn: { backgroundColor: 'rgba(255,255,255,0.3)', padding: 15, borderRadius: 10, alignItems: 'center' },
  dateText: { color: '#000', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#4B3621', borderRadius: 30, height: 55 }
});
