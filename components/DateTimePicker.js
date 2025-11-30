import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CustomDateTimePicker({ value, mode = 'date', onChange }) {
  const [show, setShow] = useState(false);

  const onPickerChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios'); // En iOS se maneja con un modal
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const showPicker = () => {
    setShow(true);
  };

  // Formatea la fecha o la hora para mostrarla en el botón
  const getFormattedValue = () => {
    if (mode === 'date') {
      return value.toLocaleDateString('es-ES'); // Formato dd/mm/aaaa
    }
    return value.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }); // Formato hh:mm
  };

  return (
    <>
      {/* El botón que el usuario ve */}
      <Pressable onPress={showPicker} style={styles.button}>
        <Text style={styles.buttonText}>{getFormattedValue()}</Text>
      </Pressable>

      {/* El selector de fecha/hora (modal en iOS, nativo en Android) */}
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onPickerChange}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#1F2937',
  },
});
