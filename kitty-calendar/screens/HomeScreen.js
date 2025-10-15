import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import InputTextoSimple from '../components/InputTextoSimple';

export default function HomeScreen({ navigation }) {
  const [alerta, setAlerta] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Este header funciona"/>

      <View style={styles.blank}>
          <Text>
            Hola! Esto es texto
          </Text>
          
          <InputTextoSimple
            placeholder="Escribe la alerta bro"
            value={alerta}
            onChangeText={setAlerta}
          />
        
        <CustomButton
          onPress={() => Alert.alert('Alertita', alerta || 'No ingresaste nada')}
        >
          Mostrar Alerta
        </CustomButton>

        <CustomButton onPress={() => navigation.navigate('Profile')}>
          Ver API
        </CustomButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  blank: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  hint: {
    marginBottom: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
