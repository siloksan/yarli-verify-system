import { useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { CameraUnavailable } from '../../components/CameraUnavailable';
import { CameraPermission } from '../../components/CameraPermission';
import { ScannerHeader } from '../../components/ScannerHeader';
import { ScannerOverlay } from '../../components/ScannerOverlay';
import { ScannerStatusPanel } from '../../components/ScannerStatusPanel';
import { ScannerCamera } from '../../components/ScannerCamera';
import { useScannerValidation } from '../../hooks/useScannerValidation';
import { ScannerCheckParams } from '@repo/api';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.8;

const getParamValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default function Scanner() {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  const params = useLocalSearchParams<ScannerCheckParams>();

  const { state, handleScan, reset } = useScannerValidation(params);
  const orderId = getParamValue(params.orderId);
  const componentId = getParamValue(params.componentId);

  useEffect(() => {
    if (
      state.status !== 'success' ||
      !orderId ||
      !componentId
    ) {
      return;
    }

    router.replace({
      pathname: '/order-recipe',
      params: {
        orderId,
        componentId,
        scanResult: state.result.scanResult,
        scannedBatch: state.result.scannedComponentBatch,
      },
    });
  }, [componentId, orderId, router, state]);

  if (!permission) {
    return <CameraPermission />;
  }

  if (!permission.granted) {
    return <CameraUnavailable requestPermission={requestPermission} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScannerHeader />

      <View style={styles.cameraContainer}>
        <ScannerCamera torch={torch} onScan={handleScan} codeTypes={['ean13']}/>

        <ScannerOverlay
          scannerSize={SCANNER_SIZE}
          torch={torch}
          onToggleTorch={() => setTorch(prev => !prev)}
        />
      </View>

      <View style={styles.instructions}>
        <ScannerStatusPanel
          isValidating={state.status === 'validating'}
          validationError={
            state.status === 'error' ? state.message : null
          }
          scanned={state.status !== 'idle'}
          scanData={
            state.status === 'idle' ? null : state.data
          }
          validationResult={
            state.status === 'success' ? state.result : null
          }
        />
        {state.status !== 'idle' && (
          <Pressable style={styles.resetButton} onPress={reset}>
            <Text style={styles.resetButtonText}>Reset scan</Text>
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
  resetButton: {
    marginTop: 16,
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
