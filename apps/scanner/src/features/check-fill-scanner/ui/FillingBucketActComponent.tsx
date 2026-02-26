import { useCameraPermissions } from 'expo-camera';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useScannerSessionStore,
  useWebViewBridgeStore,
} from '@/src/shared/stores';
import {
  AppToWebMessage,
  ICreateFillingActBucketDto,
  ScannerRequestPayload,
} from '@repo/api';
import { CameraPermission } from './CameraPermission';
import { CameraUnavailable } from './CameraUnavailable';
import { ScannerHeader } from './ScannerHeader';
import { ScannerCamera } from './ScannerCamera';
import { ScannerOverlay } from './ScannerOverlay';
import { useFillingStore } from '../model/store/filling.store';
import { useModal } from '@/src/shared/modal';
import { CameraInstructions } from './CameraInstructions';
import {
  BucketScannedSuccess,
  ScannedError,
  ScannerInProgress,
} from './ScannerModalChildrens';

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.8;
type HandleScan = (event: { data: string }) => void;

export function FillingBucketActComponent() {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const lockRef = useRef(false);
  const webViewRef = useWebViewBridgeStore((s) => s.webViewRef);
  const request = useScannerSessionStore((s) => s.request);
  const { showModal, hideModal } = useModal();
  const sendResultToWeb = (response: AppToWebMessage) => {
    if (!webViewRef) return;

    webViewRef.postMessage(JSON.stringify(response));
  };
  console.log('lockRef: ', lockRef);

  const state = useFillingStore((store) => store.state);
  const scanBucket = useFillingStore((store) => store.scanBucket);
  const scanComponent = useFillingStore((store) => store.scanComponent);
  const startBucketValidation = useFillingStore(
    (store) => store.startBucketValidation,
  );
  const startComponentValidation = useFillingStore(
    (store) => store.startComponentValidation,
  );
  const reset = useFillingStore((store) => store.reset);

  const resetScan = () => {
    reset();
    lockRef.current = false;
  };

  useEffect(() => {
    if (state.step === 'error') {
      showModal(<ScannedError hideModal={hideModal} message={state.message} />);
    }

    if (state.step === 'bucket_completed') {
      showModal(
        <BucketScannedSuccess
          hideModal={hideModal}
          lockRef={lockRef}
          componentName={state.bucket.componentName}
        />,
      );
    }
  }, [state]);
  console.log('state: ', state);

  if (!permission) {
    return <CameraPermission />;
  }

  if (!permission.granted) {
    return <CameraUnavailable requestPermission={requestPermission} />;
  }

  if (request?.type !== 'FILLING_BUCKET_ACT') {
    return null;
  }

  const { payload: requestPayload } = request;

  const handleScan: HandleScan = async ({ data }) => {
    console.log('scan');
    if (lockRef.current) return;
    lockRef.current = true;

    if (state.step === 'scan_bucket') {
      showModal(<ScannerInProgress hideModal={hideModal} />);
      startBucketValidation({
        bucketCode: data,
        testedComponentName: requestPayload.componentName,
      });

      scanBucket();
    }

    if (state.step === 'bucket_completed') {
      const createScanEventData = getCreateScanEventData(
        requestPayload,
        state.bucket.id,
        data,
      );
      startComponentValidation(createScanEventData, state.bucket);
      showModal(<ScannerInProgress hideModal={hideModal} />);
      await scanComponent();
    }
  };

  const showInstruction = () => {
    showModal(<CameraInstructions />);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ScannerHeader />

      <View style={styles.cameraContainer}>
        <ScannerCamera
          torch={torch}
          onScan={handleScan}
          codeTypes={[`${state.step === 'scan_bucket' ? 'qr' : 'ean13'}`]}
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
          <Text style={styles.targetInfoTitle}>Component to validate</Text>
          <Text style={styles.targetInfoText}>
            {requestPayload.componentName}
          </Text>
          <Text style={styles.targetInfoTitle}>Batches to validate</Text>
          <Text style={styles.targetInfoText}>
            {requestPayload.validBatches?.length
              ? requestPayload.validBatches.join(', ')
              : 'No batch restrictions'}
          </Text>
        </View>
        {state.step === 'scan_bucket' ? (
          <Pressable style={styles.resetButton} onPress={showInstruction}>
            <Text style={styles.resetButtonText}>Инструкция пользования</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.resetButton} onPress={resetScan}>
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

function getCreateScanEventData(
  request: ScannerRequestPayload,
  bucketId: string,
  code: string,
): ICreateFillingActBucketDto {
  return {
    bucketId,
    orderId: request.orderId,
    validBatchesId: request.validBatches,
    componentId: request.componentId,
    componentName: request.componentName,
    componentBarcode: code,
    workerName: 'Иван Иванович Иванов',
    weight: null,
  };
}
