import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type QuestionOption = { id: string; label: string };

type QuestionDropdownProps = {
  label: string;
  options: readonly QuestionOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  placeholder?: string;
};

export function QuestionDropdown({
  label,
  options,
  selectedId,
  onSelect,
  placeholder = 'Select a question',
}: QuestionDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === selectedId);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={selected ? styles.triggerText : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalInner}>
              <Text style={styles.modalTitle}>{label}</Text>
              <FlatList
                data={[...options]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      onSelect(item.id);
                      setOpen(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e4e4e7',
    marginBottom: 6,
  },
  trigger: {
    backgroundColor: '#18181c',
    borderWidth: 1,
    borderColor: '#2a2a30',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  triggerText: { fontSize: 16, color: '#e4e4e7' },
  placeholder: { fontSize: 16, color: '#71717a' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: { maxHeight: '70%' },
  modalInner: {
    backgroundColor: '#18181c',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: 400,
  },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#e4e4e7', marginBottom: 12 },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a30',
  },
  optionText: { fontSize: 15, color: '#e4e4e7' },
  cancelBtn: { marginTop: 12, paddingVertical: 12, alignItems: 'center' },
  cancelText: { fontSize: 16, color: '#818cf8', fontWeight: '500' },
});
