import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const MOODS = [
  { value: 1, emoji: '😞' },
  { value: 2, emoji: '😕' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😄' },
];

export default function MoodSelector({ selectedValue, onSelectMood }) {
  return (
    <View style={styles.container}>
      {MOODS.map((mood) => (
        <Pressable
          key={mood.value}
          onPress={() => onSelectMood(mood.value)}
          style={[
            styles.moodButton,
            selectedValue === mood.value && styles.selected,
          ]}
        >
          <Text style={styles.emoji}>{mood.emoji}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
  },
  moodButton: {
    padding: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    backgroundColor: '#E0E7FF',
    borderColor: '#4F46E5',
  },
  emoji: {
    fontSize: 32,
  },
});
