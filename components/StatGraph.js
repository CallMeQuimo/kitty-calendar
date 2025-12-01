import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatGraph({ data }) {
  // data espera formato: [{ label: 'Lun', value: 3 }, { label: 'Mar', value: 5 }, ...]
  // value debe ser entre 1 y 5 (escala de mood)

  const MOOD_COLORS = {
    1: '#EF4444', // Rojo (Mal)
    2: '#F59E0B', // Naranja
    3: '#FCD34D', // Amarillo (Neutro)
    4: '#A7F3D0', // Verde Claro
    5: '#10B981', // Verde (Bien)
  };

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>Sin datos suficientes</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.graphArea}>
        {data.map((item, index) => {
          // Altura relativa: (valor / 5) * 100%
          // Ajustamos un poco para que mood 1 no sea invisible (min 10%)
          const barHeight = `${Math.max(item.value * 20, 10)}%`; 
          const barColor = MOOD_COLORS[Math.round(item.value)] || '#ccc';

          return (
            <View key={index} style={styles.barContainer}>
              {/* Barra */}
              <View style={styles.barTrack}>
                 <View 
                    style={[
                        styles.bar, 
                        { height: barHeight, backgroundColor: barColor }
                    ]} 
                 />
              </View>
              {/* Etiqueta (Día) */}
              <Text style={styles.label}>{item.label}</Text>
            </View>
          );
        })}
      </View>
      
      {/* Línea base visual */}
      <View style={styles.axisLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    padding: 10,
    justifyContent: 'flex-end',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#4B3621',
    fontStyle: 'italic',
  },
  graphArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end', // Barras crecen hacia arriba
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end', // Asegura que la barra pegue abajo
    alignItems: 'center',
  },
  bar: {
    width: 12, // Ancho de la barra
    borderRadius: 6,
    minHeight: 10,
  },
  label: {
    marginTop: 5,
    fontSize: 10,
    color: '#4B3621',
    fontWeight: '600',
  },
  axisLine: {
    height: 2,
    backgroundColor: 'rgba(75, 54, 33, 0.2)', // Línea sutil marrón
    width: '100%',
  },
});
