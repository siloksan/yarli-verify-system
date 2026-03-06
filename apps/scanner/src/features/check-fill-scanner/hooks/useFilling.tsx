import { useRef, useState } from 'react';
import { useScannerSessionStore } from '@/src/shared/stores';
import { useModal } from '@/src/shared/modal';
import {
  BucketScannedSuccess,
  ComponentScannedSuccess,
  ScannedError,
  ScannerInProgress,
} from '../ui/ScannerModalChildren';
import {
  validateBucket,
  validateComponent,
} from '../model/services/filling.service';
import { transition } from '../model/machine/filling.transition';
import { FillingEffect } from '../model/machine/filling.effects';
import { FillingState } from '../model/machine/filling.state';
import { FillingEvent } from '../model/machine/filling.types';

export function useFilling() {
  const [state, setState] = useState<FillingState>({ step: 'SCAN_BUCKET' });
  const stateRef = useRef<FillingState>({ step: 'SCAN_BUCKET' });
  const isScanningRef = useRef(false);
  const { showModal, hideModal } = useModal();
  const request = useScannerSessionStore((s) => s.request);

  if (request?.type !== 'FILLING_BUCKET_ACT') return null;

  const isScannerModeAvailable =
    state.step === 'BUCKET_COMPLETED' || state.step === 'ERROR';

  const setMachineState = (nextState: FillingState) => {
    stateRef.current = nextState;
    setState(nextState);
  };

  const closeAndUnlockScanner = () => {
    isScanningRef.current = false;
    hideModal();
  };

  const dispatchEvent = async (event: FillingEvent) => {
    const { state: nextState, effects } = transition(stateRef.current, event);

    setMachineState(nextState);

    for (const effect of effects) {
      await handleEffect(effect);
    }
  };

  const handleEffect = async (effect: FillingEffect) => {
    switch (effect.type) {
      case 'SHOW_SCANNER_PROGRESS':
        showModal(<ScannerInProgress />);
        break;

      case 'VALIDATE_BUCKET': {
        const result = validateBucket(
          effect.qrCode,
          request.payload.componentName,
        );

        if (result.success) {
          await dispatchEvent({
            type: 'BUCKET_VALIDATION_SUCCESS',
            bucket: result.bucket,
          });
        } else {
          await dispatchEvent({
            type: 'BUCKET_VALIDATION_FAILURE',
            message: result.message,
          });
        }
        break;
      }

      case 'SHOW_BUCKET_SUCCESS':
        showModal(
          <BucketScannedSuccess
            turnOnScanner={closeAndUnlockScanner}
            componentName={effect.bucket.componentName ?? ''}
          />,
        );
        break;

      case 'SHOW_BUCKET_ERROR':
      case 'SHOW_COMPONENT_ERROR':
        showModal(
          <ScannedError
            resetScanner={() => {
              closeAndUnlockScanner();
              dispatchEvent({ type: 'RESET_ERROR' });
            }}
            message={effect.message}
          />,
        );
        break;

      case 'VALIDATE_COMPONENT': {
        const result = await validateComponent({
          bucketId: effect.bucket.id,
          orderId: request.payload.orderId,
          validBatchesId: request.payload.validBatches,
          recipeComponentId: request.payload.componentId,
          recipeComponentName: request.payload.componentName,
          componentBarcode: effect.barCode,
          workerName: 'РРІР°РЅ РРІР°РЅРѕРІРёС‡ РРІР°РЅРѕРІ',
          weight: null,
        });

        if (result.success) {
          await dispatchEvent({
            type: 'COMPONENT_VALIDATION_SUCCESS',
            fillingAct: result.fillingAct,
          });
        } else {
          await dispatchEvent({
            type: 'COMPONENT_VALIDATION_FAILURE',
            message: result.message,
          });
        }
        break;
      }

      case 'SHOW_COMPONENT_SUCCESS':
        showModal(
          <ComponentScannedSuccess
            componentName={effect.fillingAct.componentName}
            scannedComponentBatch={effect.fillingAct.componentBatch}
          />,
        );
        break;

      default:
        break;
    }
  };

  const handleScan = async ({ data }: { data: string }) => {
    if (isScanningRef.current) return;

    const currentStep = stateRef.current.step;
    if (currentStep !== 'SCAN_BUCKET' && currentStep !== 'BUCKET_COMPLETED') {
      return;
    }

    isScanningRef.current = true;

    if (currentStep === 'SCAN_BUCKET') {
      await dispatchEvent({ type: 'SCAN_BUCKET', qrCode: data });
      return;
    }

    await dispatchEvent({ type: 'SCAN_COMPONENT', barCode: data });
  };

  const handleBottomReset = () => {
    const currentStep = stateRef.current.step;
    console.log('currentStep: ', currentStep);

    if (currentStep === 'BUCKET_COMPLETED') {
      closeAndUnlockScanner();
      return;
    }

    if (currentStep === 'ERROR') {
      closeAndUnlockScanner();
      void dispatchEvent({ type: 'RESET_ERROR' });
    }
  };

  return {
    state,
    handleScan,
    isScannerModeAvailable,
    request,
    handleBottomReset,
  };
}
