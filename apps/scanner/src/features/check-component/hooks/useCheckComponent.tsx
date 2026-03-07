import { useRef, useState } from 'react';

import { useModal } from '@/src/shared/modal';

import { ICreateScanEventDto } from '@repo/api';
import {
  ComponentScannedSuccess,
  ScannedError,
  ScannerInProgress,
} from '@/src/shared/ui';
import {
  ErrorState,
  STEPS,
  ScanComponentState,
} from '../model/check-component.state';
import { validateComponent } from '../model/check-component.services';
import { useScannerSessionStore } from '@/src/shared/stores';

const DEFAULT_WORKER_NAME = 'Иванов Иван Иванович';

export function useCheckComponent() {
  const [state, setState] = useState<ScanComponentState>({
    step: STEPS.SCAN_COMPONENT,
  });
  const currentStateRef = useRef<ScanComponentState>(state);
  const [error, setError] = useState<ErrorState>(null);
  const prevStateRef = useRef<ScanComponentState>({
    step: STEPS.SCAN_COMPONENT,
  });
  const isScanningRef = useRef(false);
  const { showModal, hideModal } = useModal();
  const webRequest = useScannerSessionStore((s) => s.request);
  if (!webRequest) return null;

  const { componentId, componentName, orderId, validBatches } =
    webRequest.payload;
  const isScannerModeAvailable =
    state.step === STEPS.SCAN_COMPONENT || state.step === 'ERROR';

  const setCurrentState = (state: ScanComponentState) => {
    currentStateRef.current = state;
    setState(state);
  };

  const savePrevState = (state: ScanComponentState) => {
    prevStateRef.current = state;
  };

  const handleScan = async ({ data }: { data: string }) => {
    if (isScanningRef.current) return;
    isScanningRef.current = true;
    setCurrentState({
      step: STEPS.COMPONENT_VALIDATING,
    });

    showModal(<ScannerInProgress />);

    // if (currentStep === STEPS.SCAN_COMPONENT) {
    const dto: ICreateScanEventDto = {
      componentId,
      componentName,
      deviceId: 'tutel_phone',
      operatorId: DEFAULT_WORKER_NAME,
      orderId,
    };
    const resultValidation = await validateComponent(data, dto, validBatches);

    if ('errorMessage' in resultValidation) {
      const { errorMessage } = resultValidation;

      setError({ message: errorMessage, prev: state });
      setCurrentState({ step: 'ERROR' });

      showModal(
        <ScannedError resetScanner={resetFlow} message={errorMessage} />,
      );

      return;
    } else {
      setCurrentState({
        step: STEPS.SCAN_COMPLETED,
        scanEvent: resultValidation,
      });

      showModal(
        <ComponentScannedSuccess
          componentName={resultValidation.scannedComponentName}
          scannedComponentBatch={resultValidation.scannedComponentBatch}
        />,
      );
    }
  };

  const closeAndUnlockScanner = () => {
    isScanningRef.current = false;
    hideModal();
  };

  const resetFlow = () => {
    if (currentStateRef.current.step !== 'ERROR') {
      return;
    }

    closeAndUnlockScanner();
    setCurrentState(prevStateRef.current);
  };

  const resetScannerBottomBtn = () => {
    if (state.step === 'ERROR') {
      resetFlow();
    } else if (state.step === STEPS.SCAN_COMPONENT) {
      closeAndUnlockScanner();
    }
  };

  return {
    state,
    handleScan,
    isScannerModeAvailable,
    error,
    resetScannerBottomBtn,
  };
}
