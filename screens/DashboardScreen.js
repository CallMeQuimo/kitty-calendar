import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Actualizado import
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const ModuleCard = ({ title, onPress }) => (
  <TouchableOpacity style={styles.moduleCard} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.moduleText}>{title}</Text>
  </TouchableOpacity>
);

export default function DashboardScreen({ navigation }) {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Seguro que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: 'destructive', onPress: () => signOut() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.headerRow}>
        <View style={styles.logoRow}>
            <View style={styles.logoPlaceholder}>
            <Ionicons name="paw" size={24} color="#000" />
            </View>
            <Text style={styles.headerTitle}>Kitty Calendar</Text>
        </View>

        <View style={styles.actionsRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconBtn}>
                <Ionicons name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
                <Ionicons name="log-out-outline" size={24} color="#000" />
            </TouchableOpacity>
        </View>
      </View>

      {/* --- BODY --- */}
      <View style={styles.modulesContainer}>
        <ModuleCard title="Diario" onPress={() => navigation.navigate('DiaryTab')} />
        <ModuleCard title="Organizador" onPress={() => navigation.navigate('BlocksTab')} />
        <ModuleCard title="Calendario" onPress={() => navigation.navigate('CalendarTab')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#C3B091' },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#A68B6E',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  logoPlaceholder: {
    width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  iconBtn: { padding: 5 },
  modulesContainer: {
    flex: 1, paddingHorizontal: 30, justifyContent: 'center', gap: 30, paddingBottom: 50,
  },
  moduleCard: {
    backgroundColor: '#A68B6E', height: 120, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 5, elevation: 5,
  },
  moduleText: { fontSize: 20, color: '#000', fontWeight: '400', letterSpacing: 0.5 },
});
