import { useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useModal } from '@/src/shared/modal';

import {
  ErrorState,
  useFillContainer,
  FillingState,
} from '../hooks/useFillContainer';
import { CameraInstructions } from '@/src/features/check-fill-scanner/ui/CameraInstructions';
import { CameraPermission } from '@/src/features/check-fill-scanner/ui/CameraPermission';
import { CameraUnavailable } from '@/src/features/check-fill-scanner/ui/CameraUnavailable';
import { ScannerCamera } from '@/src/features/check-fill-scanner/ui/ScannerCamera';
import { ScannerHeader } from '@/src/features/check-fill-scanner/ui/ScannerHeader';
import { ScannerOverlay } from '@/src/features/check-fill-scanner/ui/ScannerOverlay';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.8;

export function FillContainerComponent() {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { showModal } = useModal();
  const filling = useFillContainer();

  const {
    state,
    handleScan,
    isScannerModeAvailable,
    resetScannerBottomBtn,
    error,
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

  const bucketData = getBucketData(state, error);
  const componentData = getComponentData(state, error);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScannerHeader />

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
          <Text style={styles.targetInfoTitle}>Flow state</Text>
          <Text style={styles.targetInfoText}>{state.step}</Text>
          {bucketData?.component.name && (
            <Text style={styles.targetInfoTitle}>
              Ёмкость c{' '}
              <Text style={styles.targetInfoText}>
                {bucketData?.component.name}
              </Text>
            </Text>
          )}
          {componentData?.componentName && (
            <>
              <Text style={styles.targetInfoTitle}>
                Компонент{' '}
                <Text style={styles.targetInfoText}>
                  {componentData?.componentName}
                </Text>
              </Text>
              <Text style={styles.targetInfoTitle}>
                Партия :
                <Text style={styles.targetInfoText}>
                  {componentData?.componentBatch}
                </Text>
              </Text>
            </>
          )}
        </View>
        {isScannerModeAvailable ? (
          <Pressable style={styles.resetButton} onPress={resetScannerBottomBtn}>
            <Text style={styles.resetButtonText}>Включить сканирование</Text>
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
});

function getBucketData(state: FillingState, error: ErrorState) {
  if ('bucketData' in state) {
    return state.bucketData;
  }
  if (error && 'prev' in error && 'bucketData' in error.prev) {
    return error.prev.bucketData;
  }
  return null;
}

function getComponentData(state: FillingState, error: ErrorState) {
  if ('fillingAct' in state) {
    return {
      componentBatch: state.fillingAct.componentBatchNumber,
      componentName: state.fillingAct.componentName,
    };
  }
  return null;
}
