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

import { useScannerSessionStore } from '@/src/shared/stores';
import { useScannerValidation } from '../hooks';
import { ScannerState } from '../types';
import { ScannerModalChildren } from './ScannerModalChildren';
import { useModal } from '@/src/shared/modal/modal.context';
import {
  CameraPermission,
  CameraUnavailable,
  ScannerCamera,
  ScannerOverlay,
} from '@/src/shared/ui';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.8;

export function CheckComponent() {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const request = useScannerSessionStore((s) => s.request);
  const { hideModal } = useModal();

  const { state, handleScan, reset, showInstruction } = useScannerValidation(
    (state: ScannerState) => (
      <ScannerModalChildren
        state={state}
        scanData={state.status === 'idle' ? null : state.data}
        validationResult={state.status === 'success' ? state.result : null}
        hideModal={hideModal}
        validationError={state.status === 'error' ? state.message : null}
      />
    ),
  );

  if (request?.type !== 'SCAN_COMPONENT') return null;
  const { payload: requestPayload } = request;

  const handleReset = () => {
    reset();
  };

  if (!permission) {
    return <CameraPermission />;
  }

  if (!permission.granted) {
    return <CameraUnavailable requestPermission={requestPermission} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.cameraContainer}>
        <ScannerCamera
          torch={torch}
          onScan={handleScan}
          codeTypes={['ean13']}
        />

        <ScannerOverlay
          scannerSize={SCANNER_SIZE}
          torch={torch}
          onToggleTorch={() => setTorch((prev) => !prev)}
        />
      </View>

      <View style={styles.instructions}>
        <View style={styles.targetInfoCard}>
          <Text style={styles.targetInfoTitle}>Проверка компонента</Text>
          <Text style={styles.targetInfoText}>
            {requestPayload?.componentName ?? 'N/A'}
          </Text>
          <Text style={styles.targetInfoTitle}>Партии для проверки</Text>
          <Text style={styles.targetInfoText}>
            {requestPayload?.validBatches?.length
              ? requestPayload.validBatches.join(', ')
              : 'No batch restrictions'}
          </Text>
        </View>
        {state.status === 'idle' ? (
          <Pressable style={styles.resetButton} onPress={showInstruction}>
            <Text style={styles.resetButtonText}>Инструкция использования</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Сканировать заново</Text>
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
