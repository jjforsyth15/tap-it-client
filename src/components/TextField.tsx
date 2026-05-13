import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  
  labelColor?: string;
  inputBackgroundColor?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
};

export function TextField({
  label,
  error,
  containerStyle,
  labelColor,
  inputBackgroundColor,
  inputBorderColor,
  inputTextColor,
  ...inputProps
}: TextFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelColor ? { color: labelColor } : null]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          inputBackgroundColor ? { backgroundColor: inputBackgroundColor } : null,
          inputBorderColor ? { borderColor: error ? '#f87171' : inputBorderColor } : null,
          inputTextColor ? { color: inputTextColor } : null,
        ]}
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
