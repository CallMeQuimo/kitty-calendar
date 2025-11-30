import React from 'react';
import { FlatList } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ListItem from '../components/ListItem';

const MOCK_DATA = [
  { id: '1', date: '2024-11-21', mood: '😊', title: 'Día tranquilo' },
  { id: '2', date: '2024-11-20', mood: '😔', title: 'Un día difícil' },
  { id: '3', date: '2024-11-19', mood: '😁', title: 'Excelente día' },
];

export default function DiaryMainScreen({ navigation }) {
  return (
    <ScreenContainer>
      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={`${item.mood}  ${item.title}`}
            subtitle={item.date}
            onPress={() => navigation.navigate('DiaryCreateEntry', { entryId: item.id })}
          />
        )}
      />
    </ScreenContainer>
  );
}
