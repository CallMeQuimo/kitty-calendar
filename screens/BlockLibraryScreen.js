import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Base de datos
import { executeSql } from '../db/database';

// Componentes Reutilizables
import ScreenContainer from '../components/ScreenContainer';
import ListItem from '../components/ListItem';
import EmptyState from '../components/EmptyState';
import CustomButton from '../components/CustomButton';

export default function BlockLibraryScreen() {
  const navigation = useNavigation();
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Recargar al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchBlocks();
    }, [])
  );

  const fetchBlocks = async () => {
    setIsLoading(true);
    try {
      const sql = `
        SELECT * FROM blocks 
        WHERE parent_roulette_id IS NULL 
        ORDER BY block_id DESC;
      `;
      const result = await executeSql(sql);
      
      // Enriquecemos la data (contar hijos o subtareas para el subtítulo)
      const enrichedBlocks = [];
      for (let i = 0; i < result.rows.length; i++) {
        const block = result.rows[i];
        let count = 0;
        
        if (block.type === 'roulette') {
           // Contar opciones de ruleta
           const countRes = await executeSql('SELECT COUNT(*) as c FROM blocks WHERE parent_roulette_id = ?', [block.block_id]);
           count = countRes.rows[0].c;
        } else {
           // Contar subtareas normales
           const countRes = await executeSql('SELECT COUNT(*) as c FROM subtasks WHERE block_id = ?', [block.block_id]);
           count = countRes.rows[0].c;
        }
        
        enrichedBlocks.push({ ...block, itemCount: count });
      }

      setBlocks(enrichedBlocks);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar tus bloques.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockPress = (block) => {
      // Navegación inteligente según tipo
      if (block.type === 'roulette') {
        navigation.navigate('Roulette', { blockId: block.block_id });
      } else {
        navigation.navigate('BlockActive', { blockId: block.block_id });
      }
  };

  const handleEdit = (block) => {
    navigation.navigate('BlockCreateEdit', { blockId: block.block_id });
  };

  // --- LÓGICA DE ELIMINACIÓN COMPLETA ---
  const handleDeleteConfirm = (block) => {
    Alert.alert(
      'Eliminar Bloque',
      `¿Estás seguro de que quieres eliminar "${block.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: () => deleteBlock(block) 
        }
      ]
    );
  };

  const deleteBlock = async (block) => {
    try {
      if (block.type === 'roulette') {
        // 1. Borrar HIJOS (Mini-bloques) primero para no dejar huérfanos
        // Primero sus subtareas (nietos)
        const children = await executeSql('SELECT block_id FROM blocks WHERE parent_roulette_id = ?', [block.block_id]);
        for (const child of children.rows) {
            await executeSql('DELETE FROM subtasks WHERE block_id = ?', [child.block_id]);
        }
        // Luego los mini-bloques
        await executeSql('DELETE FROM blocks WHERE parent_roulette_id = ?', [block.block_id]);
      } else {
        // Bloque normal: Borrar sus subtareas
        await executeSql('DELETE FROM subtasks WHERE block_id = ?', [block.block_id]);
      }

      // 2. Finalmente borrar el Bloque PADRE
      await executeSql('DELETE FROM blocks WHERE block_id = ?', [block.block_id]);

      // Recargar lista
      fetchBlocks();
      
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo eliminar el bloque.');
    }
  };

  const renderItem = ({ item }) => {
    // Subtítulo dinámico
    const typeText = item.type === 'roulette' ? 'Ruleta' : 'Bloque';
    const countText = item.type === 'roulette' ? `${item.itemCount} opciones` : `${item.itemCount} tareas`;
    const timeText = item.estimated_time > 0 ? `• ${item.estimated_time} min` : '';

    return (
      <View style={styles.itemWrapper}>
          {/* El ListItem maneja el click principal (Ejecutar/Ver) */}
          <View style={{ flex: 1 }}>
            <ListItem
                title={item.name}
                subtitle={`${typeText} • ${countText} ${timeText}`}
                iconLeft={item.type === 'roulette' ? 'shuffle' : 'layers'}
                onPress={() => handleBlockPress(item)}
            />
          </View>

          {/* Botones de Acción Laterales (Editar / Borrar) */}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconBtn}>
                <Ionicons name="create-outline" size={22} color="#4B3621" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleDeleteConfirm(item)} style={styles.iconBtn}>
                <Ionicons name="trash-outline" size={22} color="#8B0000" />
            </TouchableOpacity>
          </View>
      </View>
    );
  };

  return (
    <ScreenContainer style={styles.container}>
      
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
              title="Tu biblioteca está vacía"
              message="Crea bloques de tareas o ruletas para organizar tu día."
            />
          )
        }
      />

      {/* FAB (Floating Action Button) para Crear */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('BlockCreateEdit')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB', // Un fondo neutro claro
    paddingHorizontal: 0, // ListItem ya tiene padding o el contenedor interno
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  // Wrapper para poner los botones de acción al lado del ListItem
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden', // Para el borde
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  actionButtons: {
    flexDirection: 'row',
    paddingRight: 10,
    alignItems: 'center',
  },
  iconBtn: {
    padding: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4B3621', // Marrón oscuro acorde al diseño
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
