import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { executeSql } from '../db/database';

import ScreenContainer from '../components/ScreenContainer';
import StatGraph from '../components/StatGraph';
import CustomButton from '../components/CustomButton';

export default function DiaryStatsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState([]);
  const [averageMood, setAverageMood] = useState(0);
  const [entryCount, setEntryCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const fetchStats = async () => {
    setLoading(true);
    try {
      const sql = `SELECT date, mood FROM diary_entries ORDER BY date ASC LIMIT 7;`;
      const result = await executeSql(sql);
      const rows = result.rows;

      if (rows.length > 0) {
        const formattedData = rows.map(item => {
          const dayLabel = item.date.split('-')[2];
          return { label: dayLabel, value: item.mood };
        });
        setGraphData(formattedData);
        const totalMood = rows.reduce((sum, item) => sum + item.mood, 0);
        setAverageMood((totalMood / rows.length).toFixed(1));
        setEntryCount(rows.length);
      } else {
        setGraphData([]);
        setAverageMood(0);
        setEntryCount(0);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>ESTADÍSTICAS</Text>

        <View style={styles.summaryContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{averageMood || '-'}</Text>
            <Text style={styles.statLabel}>Promedio</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{entryCount}</Text>
            <Text style={styles.statLabel}>Entradas</Text>
          </View>
        </View>

        <View style={styles.cardBlock}>
          <Text style={styles.cardTitle}>Estado de ánimo (Últimos registros)</Text>
          <View style={styles.graphWrapper}>
            <StatGraph data={graphData} />
          </View>
        </View>

        {/* INSIGHT ELIMINADO SEGÚN REQUERIMIENTO */}
        
        <View style={styles.spacer} />

        <CustomButton onPress={() => navigation.goBack()} style={styles.brownPillButton}>
          Volver
        </CustomButton>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: '#C3B091', paddingHorizontal: 20 },
  scrollContent: { paddingTop: 10, paddingBottom: 30 },
  screenTitle: { fontSize: 18, color: '#000', textAlign: 'center', marginBottom: 20, marginTop: 10, textTransform: 'uppercase', letterSpacing: 1 },
  summaryContainer: { flexDirection: 'row', backgroundColor: '#A68B6E', borderRadius: 30, padding: 20, marginBottom: 20, justifyContent: 'space-around', alignItems: 'center', elevation: 3 },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 12, color: '#4B3621', fontWeight: 'bold', textTransform: 'uppercase', marginTop: 5 },
  divider: { width: 1, height: '80%', backgroundColor: 'rgba(75, 54, 33, 0.3)' },
  cardBlock: { backgroundColor: '#A68B6E', borderRadius: 30, padding: 20, marginBottom: 20, elevation: 3 },
  cardTitle: { color: '#2D2D2D', fontSize: 16, marginBottom: 10, textAlign: 'center' },
  graphWrapper: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 20, padding: 10 },
  spacer: { height: 20 },
  brownPillButton: { backgroundColor: '#A68B6E', borderRadius: 30, height: 55, borderWidth: 1, borderColor: '#4B3621' },
});
