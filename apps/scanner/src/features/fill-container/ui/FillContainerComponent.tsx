import { useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useModal } from '@/src/shared/modal';
import {
  CameraInstructions,
  CameraPermission,
  CameraUnavailable,
  ScannerCamera,
  ScannerOverlay,
} from '@/src/shared/ui';

import {
  ErrorState,
  FillingState,
  STEPS_DICTIONARY,
  useFillContainer,
} from '../hooks/useFillContainer';

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
  const isScannedSuccess = state.step === 'SCAN_COMPLETED';

  const actionTitle = isScannerModeAvailable
    ? 'Включить сканирование'
    : 'Инструкция по использованию';

  const onActionPress = isScannerModeAvailable
    ? resetScannerBottomBtn
    : showInstruction;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
        <ScrollView
          style={styles.instructionsScroll}
          contentContainerStyle={styles.instructionsContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.handle} />
          <View
            style={[
              styles.targetInfoCard,
              isScannedSuccess && styles.targetInfoCardSuccess,
            ]}
          >
            <Text style={styles.sectionTitle}>Информация сканирования</Text>
            <InfoRow label="Этап" value={STEPS_DICTIONARY[state.step]} />
            {bucketData?.component.name && (
              <InfoRow label="Емкость" value={bucketData.component.name} />
            )}
            {componentData?.componentName && (
              <InfoRow label="Компонент" value={componentData.componentName} />
            )}
            {componentData?.componentBatch && (
              <InfoRow label="Партия" value={componentData.componentBatch} />
            )}
          </View>

          <Pressable style={styles.resetButton} onPress={onActionPress}>
            <Text style={styles.resetButtonText}>{actionTitle}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  cameraContainer: {
    width: width,
    height: width,
    overflow: 'hidden',
    backgroundColor: '#000000',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  instructions: {
    flex: 1,
    marginTop: -12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  instructionsScroll: {
    flex: 1,
  },
  instructionsContent: {
    flexGrow: 1,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: 12,
  },
  targetInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  targetInfoCardSuccess: {
    backgroundColor: '#86EFAC',
    borderColor: '#86EFAC',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  infoValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  resetButton: {
    marginTop: 'auto',
    alignSelf: 'stretch',
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#0EA5E9',
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 2,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function getBucketData(state: FillingState, error: ErrorState) {
  if ('bucketData' in state) {
    return state.bucketData;
  }
  if (error && 'prev' in error && 'bucketData' in error.prev) {
    return error.prev.bucketData;
  }
  return null;
}

function getComponentData(state: FillingState, _error: ErrorState) {
  if ('fillingAct' in state) {
    return {
      componentBatch: state.fillingAct.componentBatchNumber,
      componentName: state.fillingAct.componentName,
    };
  }
  return null;
}
