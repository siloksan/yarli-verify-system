import { useRef, useState } from 'react';
import { FillingState } from '../model/machine/filling.types';
import { useScannerSessionStore } from '@/src/shared/stores';
import { useModal } from '@/src/shared/modal';
import {
  BucketScannedSuccess,
  ComponentScannedSuccess,
  ScannedError,
  ScannerInProgress,
} from '../ui/ScannerModalChildren';
import { FillingMachine } from '../model/machine/filling.machine';
import {
  getBucketScanState,
  getComponentScanState,
} from '../model/services/filling.service';
import { ICreateFillingActBucketDto, ScannerRequestPayload } from '@repo/api';

type HandleScan = (event: { data: string }) => void;

export function useFilling() {
  const isScanningRef = useRef(false);
  const [state, setState] = useState<FillingState>(FillingMachine.initial());
  const { showModal, hideModal } = useModal();
  const request = useScannerSessionStore((s) => s.request);
  console.log('request: ', request);
  // const isScannerModeAvailable = state.step === 'scan_bucket' || state.step === 'bucket_completed' || state.step === 'error'
  const turnOnScanner = () => {
    isScanningRef.current = false;
  };

  const resetScanner = (prevState: FillingState) => {
    isScanningRef.current = false;
    setState(prevState);
    hideModal();
  };

  if (request?.type !== 'FILLING_BUCKET_ACT') {
    return null;
  }

  const { payload: requestPayload } = request;

  const handleScan: HandleScan = async ({ data }) => {
    if (isScanningRef.current) return;
    console.log('scan');
    isScanningRef.current = true;
    showModal(<ScannerInProgress />);

    if (state.step === 'scan_bucket') {
      const resultValidation = getBucketScanState(
        data,
        requestPayload.componentName,
      );

      if (resultValidation.step === 'error') {
        showModal(
          <ScannedError
            resetScanner={resetScanner}
            message={resultValidation.message}
            prevState={state}
          />,
        );
      } else if (resultValidation.step === 'bucket_completed') {
        showModal(
          <BucketScannedSuccess
            turnOnScanner={turnOnScanner}
            componentName={requestPayload.componentName}
          />,
        );
      }

      setState(resultValidation);
    }

    if (state.step === 'bucket_completed') {
      const createScanEventData = getCreateScanEventData(
        requestPayload,
        state.bucket.id,
        data,
      );

      const resultValidation = await getComponentScanState(
        createScanEventData,
        state.bucket,
      );
      if (resultValidation.step === 'error') {
        showModal(
          <ScannedError
            resetScanner={resetScanner}
            message={resultValidation.message}
            prevState={state}
          />,
        );
      } else if (resultValidation.step === 'scan_completed') {
        console.log('resultValidation: ', resultValidation);
        showModal(
          <ComponentScannedSuccess
            componentName={resultValidation.fillingAct.componentName}
            scannedComponentBatch={resultValidation.fillingAct.componentBatch}
          />,
        );
      }
      setState(resultValidation);
    }
  };

  return { state, handleScan, turnOnScanner, request };
}

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
