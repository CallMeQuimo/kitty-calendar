import React from 'react';
import { FlatList } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ListItem from '../components/ListItem';

/* HOLA SOY LUDMILA */

const MOCK_DATA = [
  { id: '1', title: 'Rutina Mañana', date: '2024-11-20', status: 'Completado' },
  { id: '2', title: 'Gimnasio', date: '2024-11-19', status: 'Incompleto' },
  { id: '3', title: 'Limpieza', date: '2024-11-18', status: 'Completado' },
];

export default function BlockHistoryScreen() {
  return (
    <ScreenContainer>
      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subtitle={`${item.date} • ${item.status}`}
          />
        )}
      />
    </ScreenContainer>
  );
}
