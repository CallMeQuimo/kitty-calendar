import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { executeSql } from '../db/database';
import { Ionicons } from '@expo/vector-icons';

import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';

export default function DiaryCreateEntryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { existingEntry } = route.params || {}; // Recibimos datos si es edición

  const [mood, setMood] = useState(3);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (existingEntry) {
        setMood(existingEntry.mood);
        setNotes(existingEntry.notes);
        // Ajustamos la fecha string 'YYYY-MM-DD' a objeto Date (asumiendo mediodía para evitar rollovers de timezone)
        const parts = existingEntry.date.split('-');
        setDate(new Date(parts[0], parts[1] - 1, parts[2]));
    }
  }, [existingEntry]);

  const moods = [
    { val: 1, emoji: '😭', label: 'Mal' },
    { val: 2, emoji: '😟', label: 'Bajo' },
    { val: 3, emoji: '😐', label: 'Normal' },
    { val: 4, emoji: '🙂', label: 'Bien' },
    { val: 5, emoji: '😁', label: 'Súper' },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      if (existingEntry) {
        // UPDATE (Puede cambiar la fecha, así que cuidado con duplicados)
        // Primero borramos la anterior si la fecha cambió, o hacemos update directo
        // Para simplificar MVP: Hacemos UPDATE usando el entry_id original si existe, o por fecha.
        if (existingEntry.entry_id) {
             await executeSql('UPDATE diary_entries SET mood = ?, notes = ?, date = ? WHERE entry_id = ?', 
                [mood, notes, dateStr, existingEntry.entry_id]);
        }
      } else {
        // INSERT (Verificamos si ya existe entrada para esa fecha para hacer upsert manual)
        const check = await executeSql('SELECT * FROM diary_entries WHERE date = ?', [dateStr]);
        if (check.rows.length > 0) {
            Alert.alert('Ya existe', 'Ya tienes una entrada para esta fecha. Se actualizará.', [
                { text: 'Cancelar', style: 'cancel', onPress: () => setLoading(false) },
                { text: 'Sobrescribir', onPress: async () => {
                    await executeSql('UPDATE diary_entries SET mood = ?, notes = ? WHERE date = ?', [mood, notes, dateStr]);
                    navigation.goBack();
                }}
            ]);
            return;
        } else {
            await executeSql('INSERT INTO diary_entries (date, mood, notes) VALUES (?, ?, ?)', [dateStr, mood, notes]);
        }
      }
      
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar la entrada');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <ScreenContainer style={styles.background}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{existingEntry ? 'EDITAR ENTRADA' : 'NUEVA ENTRADA'}</Text>

        {/* Selector de Fecha */}
        <TouchableOpacity style={styles.dateSelector} onPress={() => setShowPicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#4B3621" />
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            <Ionicons name="pencil" size={16} color="#4B3621" />
        </TouchableOpacity>

        {showPicker && (
            <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
            />
        )}

        <View style={styles.divider} />

        <Text style={styles.subTitle}>¿Cómo te sientes?</Text>
        <View style={styles.moodContainer}>
          {moods.map((m) => (
            <TouchableOpacity 
              key={m.val} 
              style={[styles.moodBtn, mood === m.val && styles.moodSelected]}
              onPress={() => setMood(m.val)}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={styles.moodLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.label}>Notas:</Text>
          <TextInput 
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder="Escribe aquí..."
            placeholderTextColor="#4B3621"
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.spacer} />

        <CustomButton onPress={handleSave} loading={loading} style={styles.saveBtn}>
          {existingEntry ? 'Guardar Cambios' : 'Guardar Entrada'}
        </CustomButton>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: '#C3B091', paddingHorizontal: 20 },
  content: { paddingTop: 20, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#000' },
  
  dateSelector: { 
      flexDirection: 'row', alignItems: 'center', gap: 10, 
      backgroundColor: 'rgba(255,255,255,0.3)', padding: 10, borderRadius: 20, marginBottom: 10 
  },
  dateText: { fontSize: 16, fontWeight: 'bold', color: '#4B3621' },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', width: '100%', marginVertical: 20 },

  subTitle: { fontSize: 16, marginBottom: 15, color: '#4B3621' },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  moodBtn: { alignItems: 'center', padding: 10, borderRadius: 15, backgroundColor: 'rgba(166, 139, 110, 0.5)' },
  moodSelected: { backgroundColor: '#A68B6E', borderWidth: 2, borderColor: '#4B3621' },
  moodEmoji: { fontSize: 30 },
  moodLabel: { fontSize: 10, color: '#000', marginTop: 5 },

  noteContainer: { width: '100%' },
  label: { fontSize: 16, color: '#4B3621', marginBottom: 10, fontWeight: '600' },
  textArea: { 
    backgroundColor: '#A68B6E', borderRadius: 20, padding: 15, 
    height: 150, color: '#000', fontSize: 16 
  },
  spacer: { height: 30 },
  saveBtn: { backgroundColor: '#4B3621', borderRadius: 30, height: 55 }
});
