import { CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  AppStateStatus,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';

import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.8;

export default function Scanner() {
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState<string | null>(null);
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // 🟢 **URL LISTENER - Core implementation**
  useEffect(() => {
    // 1. Handle deep link that launched the app (cold start)
    const handleInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        console.log('📱 App launched with URL:', url);
      }
    };

    // 2. Handle deep links when app is already running (warm start)
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('📱 Deep link received while app running:', event.url);
    });

    handleInitialURL();

    // 3. Handle app state changes (background/foreground)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App came to foreground - check for new deep links
        Linking.getInitialURL().then((url) => {
          if (url) console.log('url: ', url);
        });
      }
    };
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Cleanup
    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, []);

  const handleScan = (event: { data: string; type?: string }) => {
    if (scanned) return;
    console.log('QR scanned:', event.data, event.type);
    setScanData(event.data);
    setScanned(true);
  };

  const resetScan = () => {
    setScanned(false);
    setScanData(null);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Требуется доступ к камере</Text>
          <Text style={styles.permissionSubtitle}>
            Разрешите доступ, чтобы сканировать QR-коды
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Нет доступа к камере</Text>
          <Text style={styles.permissionSubtitle}>
            Нажмите кнопку ниже и разрешите доступ к камере
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.permissionButtonText}>Разрешить доступ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            barcodeTypes: ['qr'],
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
                  name={torch ? 'flash' : 'flash-off'}
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
                  <Text style={styles.resetText}>Сканировать снова</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </CameraView>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        {scanned && scanData ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#1E7F3F" />
              <Text style={styles.resultTitle}>QR СЃС‡РёС‚Р°РЅ</Text>
            </View>
            <Text style={styles.resultValue}>{scanData}</Text>
            <TouchableOpacity style={styles.resultAction} onPress={resetScan}>
              <Ionicons name="scan" size={18} color="#FFFFFF" />
              <Text style={styles.resultActionText}>СЃРєР°РЅРёСЂРѕРІР°С‚СЊ РµС‰Рµ СЂР°Р·</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
        <View style={styles.instructionItem}>
          <Ionicons name="qr-code-outline" size={20} color="#666" />
          <Text style={styles.instructionText}>
            Держите QR-код в центре рамки
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="camera-outline" size={20} color="#666" />
          <Text style={styles.instructionText}>Избегайте бликов и теней</Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.instructionText}>
            Сканирование занимает 1-2 секунды
          </Text>
        </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  permissionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  resultCard: {
    backgroundColor: '#F0F8F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D6ECDD',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E7F3F',
    marginLeft: 8,
  },
  resultValue: {
    fontSize: 14,
    color: '#1C1C1C',
    marginBottom: 16,
  },
  resultAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E7F3F',
    paddingVertical: 12,
    borderRadius: 12,
  },
  resultActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});
