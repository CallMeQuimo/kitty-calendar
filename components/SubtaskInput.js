import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import FormField from './FormField';
import CustomButton from './CustomButton';

export default function SubtaskInput({ onAddSubtask }) {
  const [taskName, setTaskName] = useState('');

  const handleAdd = () => {
    if (taskName.trim().length === 0) return;
    onAddSubtask(taskName.trim());
    setTaskName(''); // Limpiamos el input
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <FormField
          placeholder="Nombre de la subtarea (ej. Lavar dientes)"
          value={taskName}
          onChangeText={setTaskName}
        />
      </View>
      <CustomButton onPress={handleAdd} style={styles.button}>
        +
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Alinea con el FormField
    marginTop: 10,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },
  button: {
    width: 50,
    height: 50,
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
