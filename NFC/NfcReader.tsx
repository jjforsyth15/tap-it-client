import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import NfcManager from 'react-native-nfc-manager';

export default function NfcReader() {
  const [hasNfc, setHasNfc] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [nfcData, setNfcData] = useState<string | null>(null);

  useEffect(() => {
    async function checkNfc() {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        setHasNfc(true);
      } else {
        setHasNfc(false);
      }
    }
    checkNfc();
  }, []);

  const readNdef = async () => {
    try {
      setIsScanning(true);
      setNfcData(null);
      // We request technology for Ndef to scan tags
      await NfcManager.requestTechnology(['Ndef', 'Tag']);
      
      const tag = await NfcManager.getTag();
      setNfcData(JSON.stringify(tag, null, 2));
    } catch (ex) {
      console.warn('NFC Reader error:', ex);
      setNfcData(JSON.stringify({ error: String(ex) }, null, 2));
    } finally {
      NfcManager.cancelTechnologyRequest();
      setIsScanning(false);
    }
  };

  if (hasNfc === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.unsupportedText}>NFC is not supported on this device.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.scanButton} onPress={readNdef}>
        <Text style={styles.scanButtonText}>Scan NFC Tag</Text>
      </TouchableOpacity>

      <Modal
        visible={isScanning || !!nfcData}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setIsScanning(false);
          setNfcData(null);
          NfcManager.cancelTechnologyRequest();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isScanning && !nfcData ? 'Ready to Scan' : 'NFC Tag Data'}
            </Text>
            
            {isScanning && !nfcData && (
              <Text style={styles.modalSubtitle}>Hold your device near the NFC tag.</Text>
            )}

            {nfcData && (
              <ScrollView style={styles.dataScroll}>
                <Text style={styles.dataText}>{nfcData}</Text>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setIsScanning(false);
                setNfcData(null);
                NfcManager.cancelTechnologyRequest();
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  unsupportedText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 350,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  dataScroll: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dataText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
