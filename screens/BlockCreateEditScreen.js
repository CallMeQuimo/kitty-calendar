import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Base de datos
import { executeSql } from '../db/database';

// Componentes
import ScreenContainer from '../components/ScreenContainer';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';

// --- Componente Auxiliar para Filas de Tareas/Opciones (Rediseñado) ---
const ListItemRow = ({ index, value, placeholder, onChange, onDelete, showTime, timeValue, onTimeChange }) => (
  <View style={styles.rowContainer}>
    <View style={styles.rowInputWrapper}>
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#4B3621" // Marrón oscuro para placeholder
            value={value}
            onChangeText={onChange}
            style={styles.transparentInput}
        />
    </View>
    
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

    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <Ionicons name="trash-outline" size={20} color="#8B0000" /> 
    </TouchableOpacity>
  </View>
);

export default function BlockCreateEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { blockId } = route.params || {};
  const isEditing = !!blockId;

  // Estados
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isRoulette, setIsRoulette] = useState(false);
  const [items, setItems] = useState([]); // [{ text: '', time: '' }]
  const [loading, setLoading] = useState(false);

  // --- Carga de Datos (Lógica igual a la anterior) ---
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
          const children = await executeSql('SELECT * FROM blocks WHERE parent_roulette_id = ?', [blockId]);
          setItems(children.rows.map(child => ({
            id: child.block_id, text: child.name, time: child.estimated_time ? child.estimated_time.toString() : ''
          })));
        } else {
          const subtasks = await executeSql('SELECT * FROM subtasks WHERE block_id = ?', [blockId]);
          setItems(subtasks.rows.map(st => ({ id: st.subtask_id, text: st.name })));
        }
      }
    } catch (error) { console.error(error); Alert.alert('Error', 'No se pudo cargar el bloque'); } 
    finally { setLoading(false); }
  };

  // --- Handlers ---
  const handleAddItem = () => setItems([...items, { text: '', time: '' }]);
  const handleUpdateItem = (idx, field, val) => { const n = [...items]; n[idx][field] = val; setItems(n); };
  const handleDeleteItem = (idx) => { const n = [...items]; n.splice(idx, 1); setItems(n); };

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
            await executeSql('UPDATE blocks SET name=?, description=?, type=?, estimated_time=? WHERE block_id=?', [name, description, type, timeVal, blockId]);
            await executeSql(isRoulette ? 'DELETE FROM blocks WHERE parent_roulette_id=?' : 'DELETE FROM subtasks WHERE block_id=?', [blockId]);
        } else {
            const res = await executeSql('INSERT INTO blocks (name, description, type, estimated_time) VALUES (?, ?, ?, ?)', [name, description, type, timeVal]);
            targetId = res.lastInsertRowId;
        }

        for (const item of validItems) {
            if (isRoulette) {
                await executeSql('INSERT INTO blocks (name, description, type, estimated_time, parent_roulette_id) VALUES (?, ?, ?, ?, ?)', [item.text, 'Opción', 'standard', parseInt(item.time)||0, targetId]);
            } else {
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
        
        {/* Título de la Pantalla */}
        <Text style={styles.screenTitle}>{isEditing ? 'Editar bloque' : 'Crear bloque'}</Text>

        {/* --- Inputs Principales (Estilo Cápsula Marrón) --- */}
        <View style={styles.formGroup}>
            {/* Nombre */}
            <FormField
                placeholder="Nombre..."
                value={name}
                onChangeText={setName}
                style={styles.brownInput} // Estilo personalizado
                placeholderTextColor="#4B3621" // Color del placeholder
                label={null} // Ocultamos el label externo
            />

            {/* Descripción */}
            <FormField
                placeholder="Descripción..."
                value={description}
                onChangeText={setDescription}
                style={[styles.brownInput, styles.textArea]} // Input más alto
                placeholderTextColor="#4B3621"
                multiline={true}
                numberOfLines={3}
                label={null}
            />

            {/* Tiempo Estimado (Solo visible si NO es ruleta) */}
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

        {/* --- Switch de Ruleta (Discreto) --- */}
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

        {/* --- Lista de Tareas / Opciones --- */}
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
                />
            ))}
        </View>

        {/* --- Botones de Acción (Estilo Cápsula Marrón) --- */}
        <CustomButton 
            onPress={handleAddItem} 
            style={styles.brownButton}
        >
            + Agregar {isRoulette ? 'opción' : 'tarea'}
        </CustomButton>

        <View style={styles.spacer} />

        <CustomButton 
            onPress={handleSave} 
            loading={loading}
            style={styles.brownButton}
        >
            Guardar
        </CustomButton>

        <View style={styles.bottomSpacer} />

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C3B091', // Beige Fondo Principal
    paddingHorizontal: 30, // Márgenes laterales más anchos como en el diseño
  },
  scrollContent: {
    paddingTop: 40,
    alignItems: 'center', // Centrar todo horizontalmente
  },
  screenTitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 30,
    fontWeight: '400',
  },
  formGroup: {
    width: '100%',
    gap: 20, // Espacio entre inputs
  },
  // Estilo "Cápsula Marrón" para Inputs y Botones
  brownInput: {
    backgroundColor: '#A68B6E', // Marrón medio
    borderRadius: 25, // Bordes muy redondeados
    borderWidth: 0,
    paddingHorizontal: 20,
    height: 60, // Altura generosa
    color: '#000',
    justifyContent: 'center',
    width: '100%',
  },
  textArea: {
    height: 100, // Descripción más alta
    textAlignVertical: 'top',
    paddingTop: 20,
  },
  brownButton: {
    backgroundColor: '#A68B6E',
    borderRadius: 25,
    height: 60,
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Switch
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  switchText: {
    color: '#4B3621',
    fontWeight: '600',
  },
  // Tiempo (Input pequeño)
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  timeLabel: {
    color: '#4B3621',
  },
  smallInput: {
    width: 80,
    height: 50,
    textAlign: 'center',
  },
  // Lista de items
  listContainer: {
    width: '100%',
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  rowInputWrapper: {
    flex: 1,
    backgroundColor: '#A68B6E', // Mismo estilo que los inputs grandes pero más pequeños
    borderRadius: 15,
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  transparentInput: {
    color: '#000',
    height: '100%',
  },
  timeWrapper: {
    flex: 0,
    width: 60,
  },
  deleteButton: {
    padding: 5,
  },
  spacer: {
    height: 40, // Espacio entre "Agregar tarea" y "Guardar"
  },
  bottomSpacer: {
    height: 50,
  }
});
