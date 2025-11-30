import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Base de datos
import { executeSql } from '../db/database';

// Componentes Reutilizables
import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';
import ListItem from '../components/ListItem';
import EmptyState from '../components/EmptyState';
import CustomModal from '../components/CustomModal';

export default function BlockLibraryScreen() {
  const navigation = useNavigation();
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para el Modal de confirmación de borrado
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState(null);

  // --- 1. Cargar Bloques desde la BD ---
  // Usamos useFocusEffect para que se ejecute cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      fetchBlocks();
    }, [])
  );

  const fetchBlocks = async () => {
    setIsLoading(true);
    try {
      // Obtenemos los bloques Y contamos sus subtareas en una sola consulta
      const sql = `
        SELECT 
          b.*, 
          (SELECT COUNT(*) FROM subtasks s WHERE s.block_id = b.block_id) as subtask_count 
        FROM blocks b
        ORDER BY b.block_id DESC;
      `;
      const result = await executeSql(sql);
      setBlocks(result.rows);
    } catch (error) {
      console.error('Error al cargar bloques:', error);
      Alert.alert('Error', 'No se pudieron cargar tus bloques.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Manejadores de Acción ---

  const handleCreateBlock = () => {
    // Navegar a la pantalla de creación (aún no creada)
    navigation.navigate('BlockCreateEdit'); 
  };

  const handleBlockPress = (block) => {
    // Al presionar, damos opciones: ¿Editar o Ejecutar?
    // Para el MVP, podríamos ir directo a Editar o mostrar un ActionSheet.
    // Aquí simularé una navegación directa a la "Ejecución" si es lo que buscas,
    // o a la edición. Según tu flujo, la biblioteca permite ver/editar/ejecutar.
    
    Alert.alert(
      block.name,
      '¿Qué deseas hacer con este bloque?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Editar', 
          onPress: () => navigation.navigate('BlockCreateEdit', { blockId: block.block_id }) 
        },
        { 
          text: '▶️ Ejecutar Ahora', 
          onPress: () => navigation.navigate('BlockActive', { blockId: block.block_id }) 
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => confirmDelete(block)
        }
      ]
    );
  };

  // --- 3. Lógica de Borrado ---

  const confirmDelete = (block) => {
    setBlockToDelete(block);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!blockToDelete) return;

    try {
      // Primero borramos subtareas asociadas (para mantener integridad si no hay CASCADE)
      await executeSql('DELETE FROM subtasks WHERE block_id = ?', [blockToDelete.block_id]);
      // Luego borramos el bloque
      await executeSql('DELETE FROM blocks WHERE block_id = ?', [blockToDelete.block_id]);
      
      // Actualizamos la lista
      fetchBlocks();
      setDeleteModalVisible(false);
      setBlockToDelete(null);
    } catch (error) {
      console.error('Error al eliminar bloque:', error);
      Alert.alert('Error', 'No se pudo eliminar el bloque.');
    }
  };

  // --- 4. Renderizado ---

  const renderItem = ({ item }) => {
    // Formateamos el subtítulo: "15 min • 5 tareas"
    const timeString = item.estimated_time > 0 ? `${item.estimated_time} min` : null;
    const taskString = `${item.subtask_count} tareas`;
    const subtitle = [timeString, taskString].filter(Boolean).join(' • ');

    return (
      <ListItem
        title={item.name}
        subtitle={subtitle}
        iconLeft={item.type === 'roulette' ? 'shuffle' : 'layers'} // Icono según tipo
        onPress={() => handleBlockPress(item)}
        // Podemos añadir un icono a la derecha como indicador
        iconRight="ellipsis-horizontal"
      />
    );
  };

  return (
    <ScreenContainer>
      
      {/* Lista de Bloques */}
      <FlatList
        data={blocks}
        keyExtractor={(item) => item.block_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={blocks.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshing={isLoading}
        onRefresh={fetchBlocks}
        ListEmptyComponent={
          !isLoading && (
            <EmptyState
              title="Aún no tienes bloques"
              message="Los bloques son rutinas o grupos de tareas. ¡Crea el primero ahora!"
              // image={require('../assets/empty-blocks.png')} // Si tuvieras imagen
            />
          )
        }
      />

      {/* Botón Flotante (FAB) para Crear */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleCreateBlock}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal de Confirmación de Borrado */}
      <CustomModal
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>¿Eliminar Bloque?</Text>
          <Text style={styles.modalText}>
            Se eliminará "{blockToDelete?.name}" y todas sus subtareas. Esta acción no se puede deshacer.
          </Text>
          
          <View style={styles.modalButtons}>
            <CustomButton 
              onPress={() => setDeleteModalVisible(false)} 
              style={[styles.modalBtn, styles.cancelBtn]}
            >
              Cancelar
            </CustomButton>
            <CustomButton 
              onPress={handleDelete} 
              style={[styles.modalBtn, styles.deleteBtn]}
            >
              Eliminar
            </CustomButton>
          </View>
        </View>
      </CustomModal>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 80, // Espacio para el FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4F46E5', // Color principal (Indigo)
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Estilos del contenido del Modal (ya que CustomModal es solo el wrapper)
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
  },
  cancelBtn: {
    backgroundColor: '#9CA3AF',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
  },
});