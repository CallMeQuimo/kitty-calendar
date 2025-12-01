import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Base de datos
import { executeSql } from '../db/database';

// Componentes
import ScreenContainer from '../components/ScreenContainer';
import CustomButton from '../components/CustomButton';

export default function RouletteScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { blockId } = route.params || {}; // ID del bloque PADRE (La Ruleta)

  const [options, setOptions] = useState([]);
  const [rouletteName, setRouletteName] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estado de la "Ruleta"
  const [displayOption, setDisplayOption] = useState(null); // Lo que se muestra actualmente
  const [winnerBlock, setWinnerBlock] = useState(null); // El resultado final
  const [isSpinning, setIsSpinning] = useState(false);

  // --- Cargar Datos ---
  useEffect(() => {
    loadRouletteData();
  }, []);

  const loadRouletteData = async () => {
    try {
      // 1. Obtener nombre de la ruleta
      const parentResult = await executeSql('SELECT name FROM blocks WHERE block_id = ?', [blockId]);
      if (parentResult.rows.length > 0) {
        setRouletteName(parentResult.rows[0].name);
      }

      // 2. Obtener las opciones (hijos)
      const childrenResult = await executeSql('SELECT * FROM blocks WHERE parent_roulette_id = ?', [blockId]);
      const children = childrenResult.rows;

      if (children.length === 0) {
        Alert.alert('Ruleta vacía', 'Esta ruleta no tiene opciones. Edítala primero.');
        navigation.goBack();
        return;
      }

      setOptions(children);
      setDisplayOption({ name: '¿Qué haremos hoy?' }); // Texto inicial

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar las opciones');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Giro (RNG) ---
  const handleSpin = () => {
    if (options.length === 0) return;

    setIsSpinning(true);
    setWinnerBlock(null);

    let counter = 0;
    const maxIterations = 20; // Cuántas veces cambia el texto antes de parar
    const intervalTime = 100; // Velocidad del cambio

    // Animación simple: Ciclar textos
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setDisplayOption(options[randomIndex]);
      counter++;

      if (counter > maxIterations) {
        clearInterval(interval);
        finalizeSpin();
      }
    }, intervalTime);
  };

  const finalizeSpin = () => {
    // Selección final real
    const finalIndex = Math.floor(Math.random() * options.length);
    const winner = options[finalIndex];
    
    setDisplayOption(winner);
    setWinnerBlock(winner);
    setIsSpinning(false);
  };

  const handleStartWinner = () => {
    if (winnerBlock) {
      // Aquí está la clave: Reemplazamos la pantalla actual con la ejecución del GANADOR
      navigation.replace('BlockActive', { blockId: winnerBlock.block_id });
    }
  };

  if (loading) return <ScreenContainer><ActivityIndicator size="large" color="#000" /></ScreenContainer>;

  return (
    <ScreenContainer style={styles.background}>
      
      <Text style={styles.headerTitle}>{rouletteName}</Text>
      
      <View style={styles.contentContainer}>
        
        {/* --- Caja Visual del Resultado --- */}
        <View style={styles.resultCard}>
          <Ionicons name="dice-outline" size={50} color="#4B3621" style={{ marginBottom: 10 }} />
          <Text style={styles.resultText}>
            {displayOption ? displayOption.name : '...'}
          </Text>
          {/* Mostrar tiempo si existe */}
          {displayOption && displayOption.estimated_time > 0 && (
            <Text style={styles.timeText}>{displayOption.estimated_time} min</Text>
          )}
        </View>

        {/* --- Botones --- */}
        {!winnerBlock ? (
            <CustomButton 
                onPress={handleSpin} 
                loading={isSpinning}
                style={styles.spinButton}
            >
                {isSpinning ? 'Girando...' : 'Girar Ruleta'}
            </CustomButton>
        ) : (
            <View style={{ width: '100%', gap: 15 }}>
                <Text style={styles.winnerText}>¡Ha tocado esta opción!</Text>
                
                <CustomButton onPress={handleStartWinner} style={styles.startButton}>
                    ¡Vamos a ello!
                </CustomButton>
                
                <CustomButton 
                    onPress={handleSpin} 
                    style={styles.retryButton}
                >
                    Girar de nuevo
                </CustomButton>
            </View>
        )}

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C3B091',
    paddingHorizontal: 20,
    justifyContent: 'center', // Centrado vertical
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  resultCard: {
    backgroundColor: '#F3E5AB', // Un beige más claro para resaltar (tipo carta)
    width: '100%',
    height: 200,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#A68B6E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B3621',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  winnerText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    fontWeight: '500',
  },
  spinButton: {
    backgroundColor: '#000', // Botón negro fuerte para acción principal
    borderRadius: 25,
    height: 55,
    width: '100%',
  },
  startButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    height: 55,
    width: '100%',
  },
  retryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 25,
    height: 55,
    width: '100%',
  },
  // Sobreescribimos el texto del botón transparente para que sea negro
  text: {
      color: '#000'
  }
});
