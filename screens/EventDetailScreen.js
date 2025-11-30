import React from 'react';
import { Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params ?? {
    event: {
      title: 'Evento de prueba',
      date: '2024-11-21',
      time: '14:00',
      description: 'Sin descripción.',
    },
  };

  return (
    <ScreenContainer>

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>{event.date} • {event.time}</Text>
      <Text style={styles.desc}>{event.description}</Text>

      <CustomButton onPress={() => navigation.navigate('EventCreateEdit')}>
        Editar
      </CustomButton>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  meta: { fontSize: 16, color: '#555', marginBottom: 20 },
  desc: { fontSize: 16, marginBottom: 30 },
});
