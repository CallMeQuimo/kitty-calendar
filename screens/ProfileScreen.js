import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import CustomButton from '../components/CustomButton';

export default function ProfileScreen() {
  const [holidays, setHolidays] = useState([]); // lista de feriados recibidos
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://date.nager.at/api/v3/NextPublicHolidays/AR';

  // ejemplo: fetchHolidays mejorado
async function fetchHolidays() {
  setLoading(true);
  setError(null);

  try {
    const res = await fetch('https://date.nager.at/api/v3/NextPublicHolidays/AR');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json(); // array de { date: 'YYYY-MM-DD', localName, name, ... }

    // fecha de hoy (sin hora) para comparar correctamente
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // filtrar fechas >= hoy y ordenar ascendentemente
    const upcoming = data
      .map(h => ({ ...h, _dateObj: new Date(h.date + 'T00:00:00') })) // fuerza parse consistente
      .filter(h => h._dateObj >= startOfToday)
      .sort((a, b) => a._dateObj - b._dateObj)
      .map(({ _dateObj, ...rest }) => rest); // opcional: quitar campo auxiliar

    // opcional: limitar cuántos mostrar (ej: próximos 5)
    setHolidays(upcoming.slice(0, 5));
  } catch (e) {
    console.error('fetchHolidays error', e);
    setError('No se pudieron cargar los feriados. Reintenta.');
    setHolidays([]);
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    fetchHolidays();
  }, []);

  function formatDate(isoDate) {
    // isoDate ejemplo: '2025-08-17' -> formateo simple a '17 ago 2025'
    try {
      const d = new Date(isoDate);
      return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return isoDate;
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.body}>
        <Text style={styles.hTitle}>Próximos feriados en Argentina(pruebita)</Text>
          <CustomButton onPress={fetchHolidays} style={{ marginTop: 12 }}>
            Actualizar(reload)
          </CustomButton>

        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

        {error ? (
          <>
            <Text style={styles.error}>{error}</Text>
            <CustomButton onPress={fetchHolidays} style={{ marginTop: 12 }}>
              Reintentar
            </CustomButton>
          </>
        ) : (
          <>
            {holidays.length === 0 && !loading ? (
              <Text style={styles.empty}>No se encontraron feriados.</Text>
            ) : (
              holidays.slice(0, 10).map((h) => (
                <View key={h.date + h.localName} style={styles.row}>
                  <View style={styles.colDate}>
                    <Text style={styles.dateText}>{formatDate(h.date)}</Text>
                  </View>
                  <View style={styles.colInfo}>
                    <Text style={styles.localName}>{h.localName}</Text>
                    {h.name && h.name !== h.localName ? <Text style={styles.engName}>{h.name}</Text> : null}
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: { padding: 16, flex: 1 },
  hTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  colDate: { width: 110 },
  dateText: { fontWeight: '700' },
  colInfo: { flex: 1 },
  localName: { fontSize: 15 },
  engName: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  empty: { color: '#6b7280', marginTop: 12 },
  error: { color: '#ef4444', marginTop: 12 },
});
