import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Base de datos
import { executeSql } from '../db/database';

// Componentes
import ScreenContainer from '../components/ScreenContainer';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal'; // Importamos el modal

// --- Componente de Fila (Actualizado con botón de configuración) ---
const ListItemRow = ({ index, value, placeholder, onChange, onDelete, showTime, timeValue, onTimeChange, onEditSubtasks, subtaskCount }) => (
  <View style={styles.rowContainer}>
    {/* Input Principal (Nombre) */}
    <View style={styles.rowInputWrapper}>
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#4B3621"
            value={value}
            onChangeText={onChange}
            style={styles.transparentInput}
        />
    </View>
    
    {/* Input de Tiempo (Solo Ruleta) */}
    {showTime && (
       <View style={[styles.rowInputWrapper, styles.timeWrapper]}>
          <TextInput
            placeholder="min"
            placeholderTextColor="#4B3621"
            value={timeValue}
            onChangeText={onTimeChange}
            keyboardType="numeric"
            style={[styles.transparentInput, { textAlign: 'center' }]}
          />
       </View>
    )}

    {/* Botón: Editar Subtareas (Solo Ruleta) */}
    {showTime && (
      <TouchableOpacity onPress={onEditSubtasks} style={styles.iconButton}>
        {/* Cambia de color si tiene subtareas definidas */}
        <Ionicons 
            name={subtaskCount > 0 ? "list" : "list-outline"} 
            size={24} 
            color={subtaskCount > 0 ? "#4F46E5" : "#4B3621"} 
        />
      </TouchableOpacity>
    )}

    {/* Botón: Eliminar */}
    <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
      <Ionicons name="trash-outline" size={24} color="#8B0000" /> 
    </TouchableOpacity>
  </View>
);

export default function BlockCreateEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { blockId } = route.params || {};
  const isEditing = !!blockId;

  // Estados Principales
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isRoulette, setIsRoulette] = useState(false);
  
  // Lista de Items. Estructura: 
  // Normal: [{ text: 'Tarea 1' }]
  // Ruleta: [{ text: 'Opción A', time: '10', subtasks: ['Paso 1', 'Paso 2'] }]
  const [items, setItems] = useState([]); 
  
  const [loading, setLoading] = useState(false);

  // --- Estados para el Modal de Subtareas (Solo Ruleta) ---
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOptionIndex, setCurrentOptionIndex] = useState(null); // Qué opción estamos editando
  const [tempSubtasks, setTempSubtasks] = useState([]); // Subtareas temporales dentro del modal
  const [newSubtaskText, setNewSubtaskText] = useState(''); // Input dentro del modal

  // --- Carga de Datos ---
  useEffect(() => {
    if (isEditing) {
      loadBlockData();
    }
  }, [blockId]);

  const loadBlockData = async () => {
    setLoading(true);
    try {
      const result = await executeSql('SELECT * FROM blocks WHERE block_id = ?', [blockId]);
      if (result.rows.length > 0) {
        const block = result.rows[0];
        setName(block.name);
        setDescription(block.description || '');
        setEstimatedTime(block.estimated_time ? block.estimated_time.toString() : '');
        setIsRoulette(block.type === 'roulette');

        if (block.type === 'roulette') {
          // Cargar Hijos (Mini-bloques)
          const children = await executeSql('SELECT * FROM blocks WHERE parent_roulette_id = ?', [blockId]);
          
          const loadedChildren = [];
          for (const child of children.rows) {
             // Cargar Nietos (Subtareas de cada Mini-bloque)
             const subtasksRes = await executeSql('SELECT name FROM subtasks WHERE block_id = ?', [child.block_id]);
             const subtasksList = subtasksRes.rows.map(s => s.name);
             
             loadedChildren.push({
                id: child.block_id, // ID real para updates (si quisiéramos ser estrictos, pero aquí borramos y creamos)
                text: child.name,
                time: child.estimated_time ? child.estimated_time.toString() : '',
                subtasks: subtasksList
             });
          }
          setItems(loadedChildren);

        } else {
          const subtasks = await executeSql('SELECT * FROM subtasks WHERE block_id = ?', [blockId]);
          setItems(subtasks.rows.map(st => ({ id: st.subtask_id, text: st.name })));
        }
      }
    } catch (error) { console.error(error); Alert.alert('Error', 'No se pudo cargar el bloque'); } 
    finally { setLoading(false); }
  };

  // --- Handlers Principales ---
  const handleAddItem = () => setItems([...items, { text: '', time: '', subtasks: [] }]);
  const handleUpdateItem = (idx, field, val) => { const n = [...items]; n[idx][field] = val; setItems(n); };
  const handleDeleteItem = (idx) => { const n = [...items]; n.splice(idx, 1); setItems(n); };

  // --- Lógica del Modal (Subtareas de Opción) ---
  const openSubtaskModal = (index) => {
    setCurrentOptionIndex(index);
    // Copiamos las subtareas actuales para editarlas sin guardar hasta confirmar
    setTempSubtasks([...(items[index].subtasks || [])]); 
    setModalVisible(true);
  };

  const addTempSubtask = () => {
    if (newSubtaskText.trim().length > 0) {
        setTempSubtasks([...tempSubtasks, newSubtaskText]);
        setNewSubtaskText('');
    }
  };

  const removeTempSubtask = (idx) => {
    const t = [...tempSubtasks];
    t.splice(idx, 1);
    setTempSubtasks(t);
  };

  const saveModalSubtasks = () => {
    const newItems = [...items];
    newItems[currentOptionIndex].subtasks = tempSubtasks;
    setItems(newItems);
    setModalVisible(false);
  };

  // --- Guardado General ---
  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Falta nombre', 'Ponle un nombre al bloque.'); return; }
    const validItems = items.filter(i => i.text.trim().length > 0);
    if (validItems.length === 0) { Alert.alert('Bloque vacío', 'Agrega al menos una tarea/opción.'); return; }

    setLoading(true);
    try {
        const type = isRoulette ? 'roulette' : 'standard';
        const timeVal = isRoulette ? 0 : (parseInt(estimatedTime) || 0);
        let targetId = blockId;

        if (isEditing) {
            // Update Padre
            await executeSql('UPDATE blocks SET name=?, description=?, type=?, estimated_time=? WHERE block_id=?', [name, description, type, timeVal, blockId]);
            // Limpieza radical para simplificar estructura anidada
            if (isRoulette) {
                // Borrar hijos anteriores y sus subtareas (Cascada manual porque SQLite a veces no la tiene)
                const oldChildren = await executeSql('SELECT block_id FROM blocks WHERE parent_roulette_id=?', [blockId]);
                for (const child of oldChildren.rows) {
                    await executeSql('DELETE FROM subtasks WHERE block_id=?', [child.block_id]);
                }
                await executeSql('DELETE FROM blocks WHERE parent_roulette_id=?', [blockId]);
            } else {
                await executeSql('DELETE FROM subtasks WHERE block_id=?', [blockId]);
            }
        } else {
            // Insert Padre
            const res = await executeSql('INSERT INTO blocks (name, description, type, estimated_time) VALUES (?, ?, ?, ?)', [name, description, type, timeVal]);
            targetId = res.lastInsertRowId;
        }

        // Insertar Hijos
        for (const item of validItems) {
            if (isRoulette) {
                // 1. Crear Mini-Bloque
                const childRes = await executeSql(
                    'INSERT INTO blocks (name, description, type, estimated_time, parent_roulette_id) VALUES (?, ?, ?, ?, ?)', 
                    [item.text, 'Opción de ruleta', 'standard', parseInt(item.time)||0, targetId]
                );
                const childId = childRes.lastInsertRowId;

                // 2. Crear Subtareas del Mini-Bloque
                if (item.subtasks && item.subtasks.length > 0) {
                    for (const subtaskName of item.subtasks) {
                        await executeSql('INSERT INTO subtasks (block_id, name) VALUES (?, ?)', [childId, subtaskName]);
                    }
                }
            } else {
                // Bloque Normal: Subtareas directas
                await executeSql('INSERT INTO subtasks (block_id, name) VALUES (?, ?)', [targetId, item.text]);
            }
        }
        navigation.goBack();
    } catch (e) { console.error(e); Alert.alert('Error', 'No se pudo guardar'); }
    finally { setLoading(false); }
  };

  return (
    <ScreenContainer style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.screenTitle}>{isEditing ? 'Editar bloque' : 'Crear bloque'}</Text>

        {/* Inputs Principales */}
        <View style={styles.formGroup}>
            <FormField
                placeholder="Nombre..."
                value={name}
                onChangeText={setName}
                style={styles.brownInput}
                placeholderTextColor="#4B3621"
                label={null}
            />
            <FormField
                placeholder="Descripción..."
                value={description}
                onChangeText={setDescription}
                style={[styles.brownInput, styles.textArea]}
                placeholderTextColor="#4B3621"
                multiline={true}
                numberOfLines={3}
                label={null}
            />
            {!isRoulette && (
                 <View style={styles.timeInputContainer}>
                    <Text style={styles.timeLabel}>Tiempo total (min):</Text>
                    <FormField
                        placeholder="0"
                        value={estimatedTime}
                        onChangeText={setEstimatedTime}
                        keyboardType="numeric"
                        style={[styles.brownInput, styles.smallInput]}
                        placeholderTextColor="#4B3621"
                        label={null}
                    />
                 </View>
            )}
        </View>

        {/* Switch Ruleta */}
        <View style={styles.switchRow}>
            <Text style={styles.switchText}>Modo Ruleta / Aleatorio</Text>
            <Switch
                trackColor={{ false: "#A68B6E", true: "#4B3621" }}
                thumbColor={isRoulette ? "#C3B091" : "#f4f3f4"}
                onValueChange={!isEditing ? setIsRoulette : () => Alert.alert('No editable')}
                value={isRoulette}
                disabled={isEditing}
            />
        </View>

        {/* Lista de Items */}
        <View style={styles.listContainer}>
            {items.map((item, index) => (
                <ListItemRow
                    key={index}
                    index={index}
                    value={item.text}
                    placeholder={isRoulette ? `Opción ${index + 1}` : `Tarea ${index + 1}`}
                    onChange={(text) => handleUpdateItem(index, 'text', text)}
                    onDelete={() => handleDeleteItem(index)}
                    showTime={isRoulette}
                    timeValue={item.time}
                    onTimeChange={(val) => handleUpdateItem(index, 'time', val)}
                    // Props nuevas para subtareas anidadas
                    onEditSubtasks={() => openSubtaskModal(index)}
                    subtaskCount={item.subtasks ? item.subtasks.length : 0}
                />
            ))}
        </View>

        <CustomButton onPress={handleAddItem} style={styles.brownButton}>
            + Agregar {isRoulette ? 'opción' : 'tarea'}
        </CustomButton>

        <View style={styles.spacer} />

        <CustomButton onPress={handleSave} loading={loading} style={styles.brownButton}>
            Guardar
        </CustomButton>

        <View style={styles.bottomSpacer} />

      </ScrollView>

      {/* --- MODAL PARA SUBTAREAS DE RULETA --- */}
      <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>Tareas de "{items[currentOptionIndex]?.text}"</Text>
            <Text style={styles.modalSubtitle}>¿Qué incluye esta opción?</Text>
            
            <View style={styles.modalInputRow}>
                <TextInput 
                    style={styles.modalInput} 
                    placeholder="Nueva subtarea..." 
                    value={newSubtaskText}
                    onChangeText={setNewSubtaskText}
                />
                <TouchableOpacity onPress={addTempSubtask} style={styles.modalAddBtn}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.modalList}>
                {tempSubtasks.length === 0 ? (
                    <Text style={styles.emptyModalText}>Sin tareas definidas aún</Text>
                ) : (
                    tempSubtasks.map((st, i) => (
                        <View key={i} style={styles.subtaskRow}>
                            <Text style={styles.subtaskText}>• {st}</Text>
                            <TouchableOpacity onPress={() => removeTempSubtask(i)}>
                                <Ionicons name="close-circle" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>

            <CustomButton onPress={saveModalSubtasks} style={styles.brownButton}>
                Confirmar Tareas
            </CustomButton>
        </View>
      </CustomModal>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: '#C3B091', paddingHorizontal: 30 },
  scrollContent: { paddingTop: 40, alignItems: 'center' },
  screenTitle: { fontSize: 18, color: '#000', marginBottom: 30, fontWeight: '400' },
  formGroup: { width: '100%', gap: 20 },
  brownInput: { backgroundColor: '#A68B6E', borderRadius: 25, borderWidth: 0, paddingHorizontal: 20, height: 60, color: '#000', justifyContent: 'center', width: '100%' },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 20 },
  brownButton: { backgroundColor: '#A68B6E', borderRadius: 25, height: 60, width: '100%', marginTop: 20, justifyContent: 'center', alignItems: 'center' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 15, paddingHorizontal: 10 },
  switchText: { color: '#4B3621', fontWeight: '600' },
  timeInputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 10 },
  timeLabel: { color: '#4B3621' },
  smallInput: { width: 80, height: 50, textAlign: 'center' },
  listContainer: { width: '100%', marginTop: 10 },
  rowContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  rowInputWrapper: { flex: 1, backgroundColor: '#A68B6E', borderRadius: 15, height: 45, justifyContent: 'center', paddingHorizontal: 15 },
  transparentInput: { color: '#000', height: '100%' },
  timeWrapper: { flex: 0, width: 60 },
  iconButton: { padding: 5 },
  spacer: { height: 40 },
  bottomSpacer: { height: 50 },

  // Estilos del Modal Interno
  modalBody: { backgroundColor: '#fff', width: '100%', borderRadius: 20, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 15 },
  modalInputRow: { flexDirection: 'row', width: '100%', gap: 10, marginBottom: 15 },
  modalInput: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 10, height: 45 },
  modalAddBtn: { width: 45, height: 45, backgroundColor: '#4F46E5', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  modalList: { width: '100%', maxHeight: 200, marginBottom: 20 },
  subtaskRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  subtaskText: { fontSize: 16, color: '#333', flex: 1 },
  emptyModalText: { textAlign: 'center', color: '#999', fontStyle: 'italic', marginVertical: 10 }
});
