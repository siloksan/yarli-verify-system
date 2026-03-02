import { useRef, useState } from 'react';

import { useModal } from '@/src/shared/modal';

import {
  BucketScannedSuccess,
  ComponentScannedSuccess,
  ScannedError,
  ScannerInProgress,
} from '@/src/features/check-fill-scanner/ui/ScannerModalChildren';
import { FillContainerEffect } from '../model/machine/fill-container.effects';
// import { FillContainerState } from '../model/machine/fill-container.state';
import { FillContainerEvent } from '../model/machine/fill-container.types';
import { transition } from '../model/machine/fill-container.transition';
import {
  validateBucketForFillContainer,
  validateBucketQrCode,
  validateComponentForFillContainer,
} from '../model/services/fill-container.service';
import { BucketQRData, IFillingActBucketResponseDto } from '@repo/api';
import { steps } from 'react-native-reanimated';

const DEFAULT_WORKER_NAME = 'Иванов Иван Иванович';
type FillingState =
  | { step: 'SCAN_BUCKET' }
  | { step: 'BUCKET_VALIDATING'; bucket: BucketQRData }
  | { step: 'BUCKET_COMPLETED'; bucketId: BucketQRData['id'] }
  | {
      step: 'COMPONENT_VALIDATING';
      bucketId: BucketQRData['id'];
      componentScanRequest: { barCode: string };
    }
  | {
      step: 'SCAN_COMPLETED';
      fillingAct: IFillingActBucketResponseDto;
    }
  | { step: 'ERROR' };

export type ErrorState = {
  message: string;
  prev: FillingState;
} | null;

export function useFillContainer() {
  const [state, setState] = useState<FillingState>({
    step: 'SCAN_BUCKET',
  });
  const [error, setError] = useState<ErrorState>(null);
  // const stateRef = useRef<FillingState>({ step: 'SCAN_BUCKET' });
  const isScanningRef = useRef(false);
  const { showModal, hideModal } = useModal();

  const isScannerModeAvailable =
    state.step === 'BUCKET_COMPLETED' || state.step === 'ERROR';

  // const setMachineState = (nextState: FillContainerState) => {
  //   stateRef.current = nextState;
  //   setState(nextState);
  // };

  const closeAndUnlockScanner = () => {
    isScanningRef.current = false;
    hideModal();
  };

  // const dispatchEvent = async (event: FillContainerEvent) => {
  //   const { state: nextState, effects } = transition(stateRef.current, event);

  //   setMachineState(nextState);

  //   for (const effect of effects) {
  //     await handleEffect(effect);
  //   }
  // };

  // const handleEffect = async (effect: FillContainerEffect) => {
  //   switch (effect.type) {
  //     case 'SHOW_SCANNER_PROGRESS':
  //       showModal(<ScannerInProgress />);
  //       break;

  //     case 'VALIDATE_BUCKET': {
  //       const result = await validateBucketForFillContainer(effect.qrCode);

  //       if (result.success) {
  //         await dispatchEvent({
  //           type: 'BUCKET_VALIDATION_SUCCESS',
  //           bucket: result.bucket,
  //         });
  //       } else {
  //         await dispatchEvent({
  //           type: 'BUCKET_VALIDATION_FAILURE',
  //           message: result.message,
  //         });
  //       }
  //       break;
  //     }

  //     case 'SHOW_BUCKET_SUCCESS':
  //       showModal(
  //         <BucketScannedSuccess
  //           turnOnScanner={closeAndUnlockScanner}
  //           componentName={effect.bucket.componentName ?? ''}
  //         />,
  //       );
  //       break;

  //     case 'SHOW_BUCKET_ERROR':
  //     case 'SHOW_COMPONENT_ERROR':
  //       showModal(
  //         <ScannedError
  //           resetScanner={() => {
  //             closeAndUnlockScanner();
  //             void dispatchEvent({ type: 'RESET_ERROR' });
  //           }}
  //           message={effect.message}
  //         />,
  //       );
  //       break;

  //     case 'VALIDATE_COMPONENT': {
  //       const result = await validateComponentForFillContainer({
  //         bucketId: effect.bucket.id,
  //         componentBarcode: effect.barCode,
  //         workerName: DEFAULT_WORKER_NAME,
  //       });

  //       if (result.success) {
  //         await dispatchEvent({
  //           type: 'COMPONENT_VALIDATION_SUCCESS',
  //           fillingAct: result.fillingAct,
  //         });
  //       } else {
  //         await dispatchEvent({
  //           type: 'COMPONENT_VALIDATION_FAILURE',
  //           message: result.message,
  //         });
  //       }
  //       break;
  //     }

  //     case 'SHOW_COMPONENT_SUCCESS':
  //       showModal(
  //         <ComponentScannedSuccess
  //           componentName={
  //             effect.fillingAct.componentName ||
  //             effect.bucket.componentName ||
  //             'Unknown component'
  //           }
  //           scannedComponentBatch={effect.fillingAct.componentBatch || 'N/A'}
  //         />,
  //       );
  //       break;

  //     default:
  //       break;
  //   }
  // };

  const handleScan = async ({ data }: { data: string }) => {
    if (isScanningRef.current) return;
    const currentStep = state.step;
    // const currentStep = stateRef.current.step;
    // if (currentStep !== 'SCAN_BUCKET' && currentStep !== 'BUCKET_READY') {
    //   return;
    // }

    isScanningRef.current = true;

    if (currentStep === 'SCAN_BUCKET') {
      const result = validateBucketQrCode(data);

      if ('errorMessage' in result) {
        setError({ message: result.errorMessage, prev: state });
        setState({ step: 'ERROR' });
        return;
        // await dispatchEvent({ type: 'SCAN_BUCKET', qrCode: qrCodeData });
      }
      // await dispatchEvent({ type: 'SCAN_BUCKET', qrCode: data });
      return;
    }

    // await dispatchEvent({ type: 'SCAN_COMPONENT', barCode: data });
  };

  const resetFlow = () => {
    closeAndUnlockScanner();
    void dispatchEvent({ type: 'RESET_FLOW' });
  };

  const handleBottomReset = () => {
    const currentStep = stateRef.current.step;

    if (currentStep === 'ERROR') {
      closeAndUnlockScanner();
      void dispatchEvent({ type: 'RESET_ERROR' });
      return;
    }

    if (currentStep !== 'SCAN_BUCKET') {
      resetFlow();
    }
  };

  return {
    state,
    handleScan,
    isScannerModeAvailable,
    handleBottomReset,
  };
}
