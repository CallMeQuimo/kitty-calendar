import React from 'react';
import { SafeAreaView, StyleSheet, Platform, View } from 'react-native';

export default function ScreenContainer({ children, style }) {
  // Usamos SafeAreaView para iOS > 10 y un View con padding para Android
  // para evitar que el contenido se ponga detrás de la barra de estado o el notch.
  // El estilo 'flex: 1' es crucial.
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Fondo blanco por defecto
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
