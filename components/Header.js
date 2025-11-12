import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';

export default function Header({ title }) {
  return (
    <View style={styles.header} accessible accessibilityRole="header">
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 12 : 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});
