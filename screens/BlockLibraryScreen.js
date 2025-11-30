import React from 'react';
import { FlatList } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ListItem from '../components/ListItem';

const MOCK_DATA = [
  { id: '1', title: 'Rutina Mañana', subtitle: '5 subtareas' },
  { id: '2', title: 'Gimnasio', subtitle: '4 subtareas' },
  { id: '3', title: 'Limpieza', subtitle: '7 subtareas' },
];

export default function BlockLibraryScreen({ navigation }) {
  return (
    <ScreenContainer>
      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => navigation.navigate('BlockActive')}
          />
        )}
      />
    </ScreenContainer>
  );
}
