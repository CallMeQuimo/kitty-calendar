import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';
import MoodSelector from '../components/MoodSelector';

export default function DiaryCreateEntryScreen() {
  const [mood, setMood] = useState(null);
  const [text, setText] = useState('');

  return (
    <ScreenContainer>
      <MoodSelector
        selectedValue={mood}
        onSelectMood={setMood}
      />

      <TextInput
        style={styles.textArea}
        placeholder="¿Cómo estuvo tu día?"
        value={text}
        onChangeText={setText}
        multiline
      />

      <CustomButton onPress={() => console.log('Guardar entrada')}>
        Guardar Entrada
      </CustomButton>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  textArea: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 20,
  },
});
