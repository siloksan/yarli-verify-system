import { useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useModal } from '@/src/shared/modal';
import {
  CameraInstructions,
  CameraPermission,
  CameraUnavailable,
  ScannerCamera,
  ScannerOverlay,
  StatusPanel,
} from '@/src/shared/ui';

import {
  ErrorState,
  FillingState,
  STEPS_DICTIONARY,
} from '../model/fill-container.state';
import { useFillContainer } from '../hooks/useFillContainer';

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
      <StatusPanel
        actionTitle={actionTitle}
        infoCardStyles={
          isScannedSuccess ? styles.targetInfoCardSuccess : undefined
        }
        onActionPress={onActionPress}
        infoRows={[
          {
            label: 'Этап',
            value: STEPS_DICTIONARY[state.step],
          },
          {
            label: 'Емкость',
            value: bucketData?.component.name,
          },
          {
            label: 'Компонент',
            value: componentData?.componentName,
          },
          {
            label: 'Партия',
            value: componentData?.componentBatch,
          },
        ]}
      />
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
  targetInfoCardSuccess: {
    backgroundColor: '#86EFAC',
    borderColor: '#86EFAC',
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

function getComponentData(state: FillingState, _error: ErrorState) {
  if ('fillingAct' in state) {
    return {
      componentBatch: state.fillingAct.componentBatch,
      componentName: state.fillingAct.componentName,
    };
  }

  return null;
}
