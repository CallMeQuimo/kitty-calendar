import React from 'react';
import ScreenContainer from '../components/ScreenContainer';
import DashboardButton from '../components/DashboardButton';

export default function DashboardScreen({ navigation }) {
  return (
    <ScreenContainer>

      <DashboardButton
        title="Diario"
        iconName="book-outline"
        onPress={() => navigation.navigate('DiaryTab')}
      />

      <DashboardButton
        title="Bloques"
        iconName="layers-outline"
        onPress={() => navigation.navigate('BlocksTab')}
      />

      <DashboardButton
        title="Calendario"
        iconName="calendar-outline"
        onPress={() => navigation.navigate('CalendarTab')}
      />

    </ScreenContainer>
  );
}
