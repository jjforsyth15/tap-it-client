import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type LinkTextProps = {
  text: string;
  onPress: () => void;
};

export function LinkText({ text, onPress }: LinkTextProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#818cf8',
    fontWeight: '500',
  },
});
