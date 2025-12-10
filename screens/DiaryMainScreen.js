import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { executeSql } from '../db/database';

import ScreenContainer from '../components/ScreenContainer';
import EmptyState from '../components/EmptyState';
import ListItem from '../components/ListItem';
import CustomButton from '../components/CustomButton';

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
    const moods = ['😭', '😟', '😐', '🙂', '😁'];
    return moods[moodVal - 1] || '😐';
  };

  const handleEditEntry = (item) => {
    // Navegamos a la pantalla de "creación" pero pasándole la entrada existente para editar
    navigation.navigate('DiaryCreateEntry', { existingEntry: item });
  };

  return (
    <ScreenContainer style={styles.background}>
      <Text style={styles.screenTitle}>MI DIARIO</Text>

      {/* Botón estadísticas mejorado */}
      <View style={{ paddingHorizontal: 40, marginBottom: 15 }}>
        <CustomButton 
            onPress={() => navigation.navigate('DiaryStats')}
            style={styles.statsButton}
        >
            <Text style={{color: '#4B3621', fontWeight: 'bold'}}>Ver estadísticas 📊</Text>
        </CustomButton>
      </View>

      <FlatList 
        data={entries}
        keyExtractor={(item) => item.entry_id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ListItem 
            title={item.date}
            subtitle={item.notes ? (item.notes.length > 30 ? item.notes.substring(0,30)+'...' : item.notes) : 'Sin notas...'}
            iconLeft={getMoodIcon(item.mood)}
            isEmojiIcon={true} // CORREGIDO: Evita que ListItem intente buscar el emoji en Ionicons
            onPress={() => handleEditEntry(item)} // CORREGIDO: Navega a edición
          />
        )}
        ListEmptyComponent={
          !loading && <EmptyState title="Diario vacío" message="Empieza a registrar cómo te sientes hoy." />
        }
      />

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
  screenTitle: { fontSize: 20, color: '#000', textAlign: 'center', marginTop: 20, marginBottom: 10, fontWeight: 'bold' },
  statsButton: { backgroundColor: 'rgba(255,255,255,0.3)', height: 40, borderRadius: 20 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: '#4B3621', width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', elevation: 5
  }
});
