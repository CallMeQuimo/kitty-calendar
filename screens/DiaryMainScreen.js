import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { executeSql } from '../db/database';
import ScreenContainer from '../components/ScreenContainer';
import EmptyState from '../components/EmptyState';
import ListItem from '../components/ListItem';

export default function DiaryMainScreen() {
  const navigation = useNavigation();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [])
  );

  const fetchEntries = async () => {
    setLoading(true);
    try {
      // Ordenamos por fecha descendente (más nuevo arriba)
      const result = await executeSql('SELECT * FROM diary_entries ORDER BY date DESC');
      setEntries(result.rows);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar el diario');
    } finally {
      setLoading(false);
    }
  };

  const getMoodIcon = (moodVal) => {
    // Mapeo simple de mood 1-5 a emojis
    const moods = ['😭', '😟', '😐', '🙂', '😁'];
    return moods[moodVal - 1] || '😐';
  };

  return (
    <ScreenContainer style={styles.background}>
      <Text style={styles.screenTitle}>MI DIARIO</Text>

      {/* Botón ver estadísticas */}
      <TouchableOpacity 
        style={styles.statsLink} 
        onPress={() => navigation.navigate('DiaryStats')}
      >
        <Text style={styles.statsText}>Ver estadísticas y gráficas {'>'}</Text>
      </TouchableOpacity>

      <FlatList 
        data={entries}
        keyExtractor={(item) => item.entry_id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ListItem 
            title={item.date} // O formatear fecha
            subtitle={item.notes || 'Sin notas...'}
            iconLeft={getMoodIcon(item.mood)}
            onPress={() => Alert.alert('Detalle', item.notes)} // Simple alert para MVP
            style={styles.entryItem}
          />
        )}
        ListEmptyComponent={
          !loading && <EmptyState title="Diario vacío" message="Empieza a registrar cómo te sientes hoy." />
        }
      />

      {/* FAB para Crear */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('DiaryCreateEntry')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: '#C3B091', paddingHorizontal: 0 },
  screenTitle: { fontSize: 20, color: '#000', textAlign: 'center', marginTop: 20, fontWeight: 'bold' },
  statsLink: { alignSelf: 'center', padding: 10, marginBottom: 10 },
  statsText: { color: '#4B3621', textDecorationLine: 'underline' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: '#4B3621', width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', elevation: 5
  }
});
