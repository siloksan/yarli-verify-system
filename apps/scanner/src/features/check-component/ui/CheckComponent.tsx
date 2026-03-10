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
  STEPS_DICTIONARY,
  ScanComponentState,
} from '../model/check-component.state';
import { useCheckComponent } from '../hooks/useCheckComponent';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.8;

export function CheckComponent() {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { showModal } = useModal();
  const scan = useCheckComponent();
  if (!scan) return null;

  const {
    componentName,
    state,
    handleScan,
    isScannerModeAvailable,
    resetScannerBottomBtn,
    error,
  } = scan;

  if (!permission) {
    return <CameraPermission />;
  }

  if (!permission.granted) {
    return <CameraUnavailable requestPermission={requestPermission} />;
  }

  const showInstruction = () => {
    showModal(<CameraInstructions />);
  };

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
            label: 'Сканируйте: ',
            value: componentName,
          },
          {
            label: 'Этап',
            value: STEPS_DICTIONARY[state.step],
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

function getComponentData(state: ScanComponentState, _error: ErrorState) {
  if ('scanEvent' in state) {
    return {
      componentBatch: state.scanEvent.scannedComponentBatch,
      componentName: state.scanEvent.scannedComponentName,
    };
  }

  return null;
}
