import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Base de datos
import { executeSql } from '../db/database';

// Componentes
import ScreenContainer from '../components/ScreenContainer';
import EmptyState from '../components/EmptyState';

export default function BlockHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyStreak, setWeeklyStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // 1. Obtenemos las ejecuciones uniendo con la tabla de bloques para saber el nombre
      // Traemos tanto completados como no completados para reflejar el diseño visual (checkbox vacío vs lleno)
      const sql = `
        SELECT 
          be.execution_id,
          be.end_time,
          be.start_time,
          be.status,
          b.name as block_name
        FROM block_executions be
        JOIN blocks b ON be.block_id = b.block_id
        ORDER BY be.start_time DESC
        LIMIT 50; 
      `;
      // Limitamos a 50 para no saturar la lista visualmente al principio

      const result = await executeSql(sql);
      const rows = result.rows;
      setHistory(rows);

      // 2. Calcular Racha Semanal (Bloques completados en los últimos 7 días)
      calculateStreak(rows);

    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (data) => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const count = data.filter(item => {
      if (item.status !== 'completed') return false;
      const itemDate = new Date(item.end_time || item.start_time);
      return itemDate >= sevenDaysAgo && itemDate <= now;
    }).length;

    setWeeklyStreak(count);
  };

  // Función para formatear fecha (ej: "20/10")
  const formatDate = (dateString) => {
    if (!dateString) return '--/--';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  const renderItem = ({ item }) => {
    const isCompleted = item.status === 'completed';
    const displayDate = formatDate(item.end_time || item.start_time);

    return (
      <View style={styles.historyItem}>
        {/* Columna Fecha */}
        <Text style={styles.dateText}>{displayDate}</Text>
        
        {/* Columna Nombre */}
        <Text style={styles.blockNameText} numberOfLines={1}>
          {item.block_name}
        </Text>

        {/* Columna Checkbox */}
        <View style={styles.iconContainer}>
            <Ionicons 
                name={isCompleted ? "checkbox" : "square-outline"} 
                size={24} 
                color="#2D2D2D" // Color oscuro para el check
            />
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer style={styles.background}>
      
      {/* Título de Pantalla */}
      <Text style={styles.screenTitle}>Historial de bloques</Text>

      {/* Sección Racha */}
      <Text style={styles.streakLabel}>
        Racha semanal: <Text style={styles.streakValue}>{weeklyStreak}</Text>
      </Text>

      {/* Lista */}
      {loading ? (
        <ActivityIndicator size="large" color="#4B3621" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.execution_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState 
              title="Sin actividad reciente" 
              message="Completa bloques para verlos aquí." 
            />
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C3B091', // Fondo Beige Oscuro (fiel al diseño)
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 20,
    color: '#2D2D2D',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '500', // Un poco más fino que bold
  },
  streakLabel: {
    fontSize: 16,
    color: '#2D2D2D',
    marginBottom: 30,
    textAlign: 'center', // Alineado a la izquierda según diseño, o center si prefieres
  },
  streakValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  listContent: {
    paddingBottom: 20,
    gap: 15, // Espacio entre cápsulas
  },
  // Estilo de la Cápsula (Fila)
  historyItem: {
    backgroundColor: '#A68B6E', // Marrón medio
    borderRadius: 30, // Bordes muy redondeados (Pill shape)
    height: 70, // Altura fija para consistencia visual
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    color: '#2D2D2D',
    width: 60, // Ancho fijo para alinear la segunda columna
  },
  blockNameText: {
    fontSize: 18,
    color: '#2D2D2D',
    flex: 1, // Toma todo el espacio central
    textAlign: 'center', // Centrado como en la imagen
    fontWeight: '400',
  },
  iconContainer: {
    width: 30,
    alignItems: 'flex-end',
  }
});
