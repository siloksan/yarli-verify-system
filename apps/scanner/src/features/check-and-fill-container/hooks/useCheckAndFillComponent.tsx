import { useRef, useState } from 'react';

import { useModal } from '@/src/shared/modal';

import { ICreateFillingContainerActDto } from '@repo/api';
import { ErrorState, FillingState } from '../model/fill-container.state';
import {
  validateBucketQrCode,
  validateComponentForFillContainer,
  validateContainerById,
} from '../model/fill-container.services';
import {
  BucketScannedSuccess,
  ComponentScannedSuccess,
  ScannedError,
  ScannerInProgress,
} from '@/src/shared/ui';

const DEFAULT_WORKER_NAME = 'Иванов Иван Иванович';

export function useCheckAndFillComponent() {
  const [state, setState] = useState<FillingState>({
    step: 'SCAN_BUCKET',
  });
  const currentStateRef = useRef<FillingState>(state);
  const [error, setError] = useState<ErrorState>(null);
  const prevStateRef = useRef<FillingState>({ step: 'SCAN_BUCKET' });
  const isScanningRef = useRef(false);
  const { showModal, hideModal } = useModal();

  const isScannerModeAvailable =
    state.step === 'BUCKET_COMPLETED' || state.step === 'ERROR';

  const setCurrentState = (state: FillingState) => {
    currentStateRef.current = state;
    setState(state);
  };

  const savePrevState = (state: FillingState) => {
    prevStateRef.current = state;
  };

  const handleScan = async ({ data }: { data: string }) => {
    if (isScanningRef.current) return;
    const currentStep = state.step;
    isScanningRef.current = true;

    if (currentStep === 'SCAN_BUCKET') {
      const resultQrValidation = validateBucketQrCode(data);
      console.log('resultQrValidation: ', resultQrValidation);

      if ('errorMessage' in resultQrValidation) {
        const { errorMessage } = resultQrValidation;

        setError({ message: errorMessage, prev: state });
        setCurrentState({ step: 'ERROR' });

        showModal(
          <ScannedError resetScanner={resetFlow} message={errorMessage} />,
        );
        return;
      } else {
        setCurrentState({
          step: 'BUCKET_VALIDATING',
          bucketQr: resultQrValidation,
        });

        showModal(<ScannerInProgress />);

        const resultBucketValidation = await validateContainerById(
          resultQrValidation.id,
        );

        if ('errorMessage' in resultBucketValidation) {
          const { errorMessage } = resultBucketValidation;

          setError({
            message: errorMessage,
            prev: state,
          });
          setCurrentState({ step: 'ERROR' });

          showModal(
            <ScannedError resetScanner={resetFlow} message={errorMessage} />,
          );

          return;
        } else {
          const newState = {
            step: 'BUCKET_COMPLETED',
            bucketData: resultBucketValidation,
          } as const;

          setCurrentState(newState);
          savePrevState(newState);

          showModal(
            <BucketScannedSuccess
              turnOnScanner={closeAndUnlockScanner}
              componentName={resultBucketValidation.component.name}
            />,
          );
          return;
        }
      }
    }

    if (currentStep === 'BUCKET_COMPLETED') {
      const {
        bucketData: { id: bucketId },
      } = state;

      setCurrentState({
        step: 'COMPONENT_VALIDATING',
        bucketData: state.bucketData,
        barCode: data,
      });

      showModal(<ScannerInProgress />);

      const createFillContainerActDto: ICreateFillingContainerActDto = {
        componentBarcode: data,
        workerName: DEFAULT_WORKER_NAME,
      };

      const resultComponentValidation = await validateComponentForFillContainer(
        bucketId,
        createFillContainerActDto,
      );

      if ('errorMessage' in resultComponentValidation) {
        const { errorMessage } = resultComponentValidation;
        setError({
          message: errorMessage,
          prev: state,
        });
        setCurrentState({ step: 'ERROR' });

        showModal(
          <ScannedError resetScanner={resetFlow} message={errorMessage} />,
        );

        return;
      } else {
        const newState = {
          step: 'SCAN_COMPLETED',
          fillingAct: resultComponentValidation,
          bucketData: state.bucketData,
        } as const;

        setCurrentState(newState);

        showModal(
          <ComponentScannedSuccess
            componentName={resultComponentValidation.componentName}
            scannedComponentBatch={
              resultComponentValidation.componentBatchNumber
            }
          />,
        );
        return;
      }
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
    } else if (state.step === 'BUCKET_COMPLETED') {
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
