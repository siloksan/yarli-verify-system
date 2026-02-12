import { CameraView } from 'expo-camera';
import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.8;

export default function Scanner({ onScan }) {
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  
  const handleScan = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    onScan(data);
  };

  const resetScan = () => setScanned(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Сканирование QR-кода</Text>
        <Text style={styles.headerSubtitle}>
          Наведите камеру на QR-код компонента
        </Text>
      </View>

      {/* Camera Container */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleScan}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          enableTorch={torch}
        >
          {/* Scanner Overlay */}
          <View style={styles.overlay}>
            {/* Semi-transparent background */}
            <View style={styles.overlayTop} />
            
            <View style={styles.overlayRow}>
              <View style={styles.overlaySide} />
              
              {/* Scanner Frame */}
              <View style={styles.scannerFrame}>
                {/* Corner borders */}
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
                
                {/* Scanning line animation */}
                <View style={styles.scanLine} />
              </View>
              
              <View style={styles.overlaySide} />
            </View>
            
            <View style={styles.overlayBottom}>
              {/* Flashlight Toggle */}
              <TouchableOpacity 
                style={styles.torchButton}
                onPress={() => setTorch(!torch)}
              >
                <Ionicons 
                  name={torch ? "flash" : "flash-off"} 
                  size={24} 
                  color="white" 
                />
                <Text style={styles.torchText}>
                  {torch ? 'Выключить фонарик' : 'Включить фонарик'}
                </Text>
              </TouchableOpacity>

              {/* Reset Button */}
              {scanned && (
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={resetScan}
                >
                  <Ionicons name="scan" size={24} color="white" />
                  <Text style={styles.resetText}>
                    Сканировать снова
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </CameraView>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <View style={styles.instructionItem}>
          <Ionicons name="qr-code-outline" size={20} color="#666" />
          <Text style={styles.instructionText}>
            Держите QR-код в центре рамки
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="camera-outline" size={20} color="#666" />
          <Text style={styles.instructionText}>
            Избегайте бликов и теней
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.instructionText}>
            Сканирование занимает 1-2 секунды
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cameraContainer: {
    width: width,
    height: width,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  overlayRow: {
    flexDirection: 'row',
    height: SCANNER_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scannerFrame: {
    width: SCANNER_SIZE,
    height: SCANNER_SIZE,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanLine: {
    width: SCANNER_SIZE - 40,
    height: 2,
    backgroundColor: '#00FF00',
    position: 'absolute',
    top: SCANNER_SIZE / 2,
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  torchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  torchText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  instructions: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },
});
