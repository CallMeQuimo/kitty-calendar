import React, { useState } from 'react';
import { View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import FormField from '../components/FormField';
import DateTimePicker from '../components/DateTimePicker';
import CustomButton from '../components/CustomButton';

export default function EventCreateEditScreen() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  return (
    <ScreenContainer>

      <FormField
        label="Título del evento"
        value={title}
        onChangeText={setTitle}
      />

      <DateTimePicker
        mode="date"
        value={date}
        onChange={setDate}
      />

      <DateTimePicker
        mode="time"
        value={time}
        onChange={setTime}
      />

      <CustomButton onPress={() => console.log('Guardar evento')}>
        Guardar Evento
      </CustomButton>

    </ScreenContainer>
  );
}
