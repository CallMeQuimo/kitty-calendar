import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Base de Datos
import { executeSql } from '../db/database';

// Componentes
import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';

// Componente Auxiliar: Fila de Tarea (Estilo Cápsula Marrón)
const TaskRow = ({ label, isCompleted, onToggle }) => (
  <TouchableOpacity style={styles.taskContainer} onPress={onToggle} activeOpacity={0.8}>
    {/* Checkbox Cuadrado */}
    <View style={styles.checkboxContainer}>
       <Ionicons 
         name={isCompleted ? "checkbox" : "square-outline"} 
         size={24} 
         color="#2D2D2D" 
       />
    </View>
    {/* Texto de la Tarea */}
    <Text style={[styles.taskText, isCompleted && styles.taskTextCompleted]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function BlockActiveScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { blockId } = route.params || {};

  const [blockName, setBlockName] = useState('');
  const [tasks, setTasks] = useState([]); 
  const [executionId, setExecutionId] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. Lógica de Inicio (Sin cambios) ---
  useEffect(() => {
    startBlockExecution();
  }, []);

  const startBlockExecution = async () => {
    try {
      // Cargar datos del bloque
      const blockResult = await executeSql('SELECT * FROM blocks WHERE block_id = ?', [blockId]);
      if (blockResult.rows.length === 0) {
        Alert.alert('Error', 'Bloque no encontrado');
        navigation.goBack();
        return;
      }
      setBlockName(blockResult.rows[0].name);

      // Cargar tareas
      const tasksResult = await executeSql('SELECT * FROM subtasks WHERE block_id = ?', [blockId]);
      const initialTasks = tasksResult.rows.map(t => ({
        id: t.subtask_id, name: t.name, completed: false
      }));
      setTasks(initialTasks);

      // Iniciar Ejecución
      const now = new Date().toISOString();
      const insertExec = await executeSql(
        `INSERT INTO block_executions (block_id, start_time, status) VALUES (?, ?, ?)`,
        [blockId, now, 'in_progress']
      );
      setExecutionId(insertExec.lastInsertRowId);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo iniciar.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const handleFinish = async () => {
    if (!executionId) return;
    setLoading(true);
    try {
      const now = new Date().toISOString();
      await executeSql(`UPDATE block_executions SET end_time = ?, status = ? WHERE execution_id = ?`, [now, 'completed', executionId]);
      
      for (const task of tasks) {
        await executeSql(
          `INSERT INTO execution_subtask_status (execution_id, subtask_id, is_completed) VALUES (?, ?, ?)`,
          [executionId, task.id, task.completed ? 1 : 0]
        );
      }
      
      Alert.alert('¡Excelente!', 'Bloque finalizado.', [
        { text: 'Volver', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos para la UI
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <ScreenContainer style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Título del Bloque */}
        <Text style={styles.blockTitle}>{blockName}</Text>

        {/* --- Indicador de Progreso (Cápsula Grande) --- */}
        <View style={styles.progressCapsule}>
            <Text style={styles.progressLabel}>Progreso</Text>
            <Text style={styles.progressValue}>{completedCount}/{totalCount}</Text>
        </View>

        {/* --- Lista de Tareas --- */}
        <View style={styles.listContainer}>
            {tasks.map((task, index) => (
                <TaskRow
                    key={task.id}
                    label={task.name}
                    isCompleted={task.completed}
                    onToggle={() => handleToggleTask(index)}
                />
            ))}
            
            {tasks.length === 0 && (
                <Text style={styles.emptyText}>Sin tareas específicas</Text>
            )}
        </View>

        <View style={styles.spacer} />

        {/* --- Botón Finalizar --- */}
        <CustomButton 
            onPress={handleFinish} 
            loading={loading}
            style={styles.brownButton}
        >
            Finalizar
        </CustomButton>

        <View style={styles.bottomSpacer} />

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C3B091', // Beige Fondo
    paddingHorizontal: 30, 
  },
  scrollContent: {
    paddingTop: 40,
    alignItems: 'center',
  },
  blockTitle: {
    fontSize: 20,
    color: '#000', // Texto negro u oscuro
    marginBottom: 30,
    fontWeight: '400',
    textAlign: 'center',
  },
  
  // Estilo Cápsula General (Usado para Progreso y Botones)
  progressCapsule: {
    backgroundColor: '#A68B6E', // Marrón medio
    borderRadius: 25,
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    color: '#000',
  },
  progressValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },

  // Lista
  listContainer: {
    width: '100%',
    gap: 15, // Espacio entre tareas
  },
  
  // Fila de Tarea
  taskContainer: {
    backgroundColor: '#A68B6E', // Mismo marrón
    borderRadius: 25,
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    marginRight: 20,
  },
  taskText: {
    fontSize: 16,
    color: '#000',
    flex: 1, // Para que ocupe el resto del espacio
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },

  emptyText: {
    color: '#4B3621',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  spacer: {
    height: 40,
  },
  bottomSpacer: {
    height: 50,
  },

  // Botón Finalizar (Reutilizamos estilo marrón)
  brownButton: {
    backgroundColor: '#A68B6E',
    borderRadius: 25,
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});