import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
};

export function TextField({
  label,
  error,
  containerStyle,
  ...inputProps
}: TextFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#71717a"
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e4e4e7',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#18181c',
    borderWidth: 1,
    borderColor: '#2a2a30',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#e4e4e7',
  },
  inputError: {
    borderColor: '#f87171',
  },
  errorText: {
    fontSize: 12,
    color: '#f87171',
    marginTop: 4,
  },
});
