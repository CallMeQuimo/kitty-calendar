import React from 'react';
import { FlatList } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ListItem from '../components/ListItem';

const MOCK_DATA = [
  { id: '1', title: 'Rutina Mañana', subtitle: '5 subtareas' },
  { id: '2', title: 'Gimnasio', subtitle: '4 subtareas' },
  { id: '3', title: 'Limpieza', subtitle: '7 subtareas' },
];

export default function BlockLibraryScreen({ navigation }) {
  return (
    <ScreenContainer>
      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => navigation.navigate('BlockActive')}
          />
        )}
      />
    </ScreenContainer>
  );
}
import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Base de datos (Lógica original intacta)
import { executeSql } from '../db/database';

// Componentes Reutilizables
import EmptyState from '../components/EmptyState';

export default function BlockLibraryScreen() {
  const navigation = useNavigation();
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. LÓGICA DE NEGOCIO (INTACTA) ---
  
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

      // Enriquecemos la data
      const enrichedBlocks = [];
      for (let i = 0; i < result.rows.length; i++) {
        const block = result.rows[i];
        let count = 0;

        if (block.type === 'roulette') {
          const countRes = await executeSql('SELECT COUNT(*) as c FROM blocks WHERE parent_roulette_id = ?', [block.block_id]);
          count = countRes.rows[0].c;
        } else {
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
    if (block.type === 'roulette') {
      navigation.navigate('Roulette', { blockId: block.block_id });
    } else {
      navigation.navigate('BlockActive', { blockId: block.block_id });
    }
  };

  const handleEdit = (block) => {
    navigation.navigate('BlockCreateEdit', { blockId: block.block_id });
  };

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
        const children = await executeSql('SELECT block_id FROM blocks WHERE parent_roulette_id = ?', [block.block_id]);
        for (const child of children.rows) {
          await executeSql('DELETE FROM subtasks WHERE block_id = ?', [child.block_id]);
        }
        await executeSql('DELETE FROM blocks WHERE parent_roulette_id = ?', [block.block_id]);
      } else {
        await executeSql('DELETE FROM subtasks WHERE block_id = ?', [block.block_id]);
      }
      await executeSql('DELETE FROM blocks WHERE block_id = ?', [block.block_id]);
      fetchBlocks();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo eliminar el bloque.');
    }
  };

  // --- 2. RENDER UI (DISEÑO FIGMA / EARTH TONES) ---

  const renderItem = ({ item }) => {
    // Textos informativos
    const isRoulette = item.type === 'roulette';
    const typeLabel = isRoulette ? 'Ruleta' : 'Bloque';
    const countLabel = isRoulette ? `${item.itemCount} opc.` : `${item.itemCount} tareas`;
    const timeLabel = item.estimated_time > 0 ? `${item.estimated_time}m` : '';
    
    // Icono principal según tipo
    const mainIcon = isRoulette ? 'shuffle' : 'layers-outline';

    return (
      <View style={styles.cardContainer}>
        {/* Parte Principal (Clickable) */}
        <TouchableOpacity 
          style={styles.cardMainArea} 
          activeOpacity={0.8}
          onPress={() => handleBlockPress(item)}
        >
          {/* Icono Izquierda */}
          <View style={styles.iconCircle}>
            <Ionicons name={mainIcon} size={20} color="#3E3024" />
          </View>

          {/* Textos */}
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>
              {typeLabel} • {countLabel} {timeLabel && `• ${timeLabel}`}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Separador vertical sutil */}
        <View style={styles.verticalDivider} />

        {/* Acciones (Editar / Borrar) Integradas a la derecha */}
        <View style={styles.actionsArea}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
            <Ionicons name="pencil-outline" size={20} color="#3E3024" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => handleDeleteConfirm(item)} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={20} color="#5C2525" /> 
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Título de la pantalla (opcional, para contexto) */}
      <Text style={styles.headerTitle}>Mis Bloques</Text>

      <FlatList
        data={blocks}
        keyExtractor={(item) => item.block_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={blocks.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshing={isLoading}
        onRefresh={fetchBlocks}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading && (
            <EmptyState
              title="Tu biblioteca está vacía"
              message="Crea bloques o ruletas para empezar."
              // Pasamos estilos custom al EmptyState si soporta, si no, se verá default
            />
          )
        }
      />

      {/* FAB (Floating Action Button) Estilo "Tierra" */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('BlockCreateEdit')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#E8DCCA" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --- ESTILOS "EARTH TONES" (Coherencia Visual) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8B69B', // Fondo Beige Principal
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  listContent: {
    paddingBottom: 100, // Espacio para el FAB
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  // --- CÁPSULA / TARJETA DEL BLOQUE ---
  cardContainer: {
    backgroundColor: '#A99076', // Marrón Medio (Igual a las píldoras de la pantalla anterior)
    borderRadius: 24, // Bordes muy redondeados
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80, // Altura consistente
    paddingLeft: 16,
    paddingRight: 8,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Área principal (Click para abrir)
  cardMainArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  
  // Icono circular a la izquierda
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semitransparente para dar profundidad
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  // Textos
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#3E3024', // Marrón muy oscuro para subtítulos
    marginTop: 2,
    opacity: 0.8,
  },

  // Divisor vertical
  verticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 8,
  },

  // Botones de acción (Editar/Borrar)
  actionsArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 10,
  },

  // --- FAB (Botón Flotante) ---
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    backgroundColor: '#5C4D3C', // Marrón oscuro de contraste
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
