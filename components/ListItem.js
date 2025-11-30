import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Usamos los íconos que instalamos

export default function ListItem({ title, subtitle, onPress, iconLeft, iconRight = "chevron-forward" }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      {iconLeft && (
        <View style={styles.iconContainer}>
          {/* Suponemos que iconLeft es un string de nombre de Ionicons o un emoji (texto) */}
          {typeof iconLeft === 'string' ? (
             <Ionicons name={iconLeft} size={24} color="#6B7280" />
          ) : (
             <Text style={styles.emojiIcon}>{iconLeft}</Text>
          )}
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {iconRight && (
        <View style={styles.iconContainer}>
           <Ionicons name={iconRight} size={20} color="#9CA3AF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB', // Un fondo gris claro
    borderRadius: 10,
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  iconContainer: {
    width: 24, // Ancho fijo para alinear
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiIcon: {
    fontSize: 24,
  }
});
