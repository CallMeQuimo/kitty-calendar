import React from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';

export default function CustomModal({ visible, onClose, children }) {
  return (
    <Modal
      animationType="fade" // 'fade' o 'slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Fondo semitransparente */}
      <Pressable style={styles.backdrop} onPress={onClose} />
      
      {/* Contenedor del contenido */}
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Oscurece el fondo
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // Centra el modal verticalmente
    alignItems: 'center',    // Centra el modal horizontalmente
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
