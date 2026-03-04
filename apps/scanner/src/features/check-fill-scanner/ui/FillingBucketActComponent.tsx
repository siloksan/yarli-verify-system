import { useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useModal } from '@/src/shared/modal';
import { useFilling } from '../hooks/useFilling';
import {
  CameraInstructions,
  CameraPermission,
  CameraUnavailable,
  ScannerCamera,
  ScannerOverlay,
} from '@/src/shared/ui';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.8;

export function FillingBucketActComponent() {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { showModal, hideModal } = useModal();
  const filling = useFilling();
  if (!filling) return null;

  const {
    state,
    handleScan,
    request,
    isScannerModeAvailable,
    handleBottomReset,
  } = filling;

  if (!permission) {
    return <CameraPermission />;
  }

  if (!permission.granted) {
    return <CameraUnavailable requestPermission={requestPermission} />;
  }

  const showInstruction = () => {
    showModal(<CameraInstructions />);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.cameraContainer}>
        <ScannerCamera
          torch={torch}
          onScan={handleScan}
          codeTypes={['qr', 'ean13']}
        />
        <ScannerOverlay
          scannerSize={SCANNER_SIZE}
          torch={torch}
          onToggleTorch={() => setTorch((prev) => !prev)}
        />
      </View>
      <View style={styles.instructions}>
        <View style={styles.targetInfoCard}>
          <Text style={styles.targetInfoText}>step: {state.step}</Text>
          <Text style={styles.targetInfoTitle}>Компонент на проверку</Text>
          <Text style={styles.targetInfoText}>
            {request.payload.componentName}
          </Text>
          <Text style={styles.targetInfoTitle}>Валидные партии</Text>
          <Text style={styles.targetInfoText}>
            {request.payload.validBatches?.length
              ? request.payload.validBatches.join(', ')
              : 'Партии не указаны'}
          </Text>
        </View>
        {isScannerModeAvailable ? (
          <Pressable style={styles.resetButton} onPress={handleBottomReset}>
            <Text style={styles.resetButtonText}>Сканировать заново</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.resetButton} onPress={showInstruction}>
            <Text style={styles.resetButtonText}>Инструкция использования</Text>
          </Pressable>
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
  instructions: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  targetInfoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 12,
  },
  targetInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  targetInfoText: {
    fontSize: 14,
    color: '#1C1C1C',
    marginBottom: 10,
  },
  resetButton: {
    marginTop: 4,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalText: {
    fontSize: 14,
    color: '#1C1C1C',
    marginBottom: 8,
  },
});
