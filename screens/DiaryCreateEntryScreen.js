import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { executeSql } from '../db/database';

import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';

export default function DiaryCreateEntryScreen() {
  const navigation = useNavigation();
  const [mood, setMood] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

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
      // CORRECCIÓN: Usar fecha local, no UTC
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const check = await executeSql('SELECT * FROM diary_entries WHERE date = ?', [dateStr]);
      
      if (check.rows.length > 0) {
        await executeSql('UPDATE diary_entries SET mood = ?, notes = ? WHERE date = ?', [mood, notes, dateStr]);
      } else {
        await executeSql('INSERT INTO diary_entries (date, mood, notes) VALUES (?, ?, ?)', [dateStr, mood, notes]);
      }
      
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar la entrada');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.background}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>¿CÓMO TE SIENTES HOY?</Text>

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
          <Text style={styles.label}>Notas del día:</Text>
          <TextInput 
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder="Hoy me sentí..."
            placeholderTextColor="#4B3621"
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.spacer} />

        <CustomButton onPress={handleSave} loading={loading} style={styles.saveBtn}>
          Guardar Entrada
        </CustomButton>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: '#C3B091', paddingHorizontal: 20 },
  content: { paddingTop: 20, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 30, color: '#000' },
  
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
