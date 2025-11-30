import React from 'react';
import { View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';

export default function SettingsScreen({ navigation }) {
  return (
    <ScreenContainer>

      <CustomButton onPress={() => console.log('Cambiar Tema')}>
        Cambiar Tema
      </CustomButton>

      <CustomButton onPress={() => console.log('Ver feriados de Argentina')}>
        Feriados (AR)
      </CustomButton>

      <CustomButton onPress={() => navigation.navigate('Welcome')}>
        Cerrar Sesión
      </CustomButton>

    </ScreenContainer>
  );
}
