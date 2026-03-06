import { useCallback, useRef, useState } from 'react';

import { useModal } from '@/src/shared/modal';
import { useScannerSessionStore } from '@/src/shared/stores';
import { ScannerState } from '../types';
import { validateCode } from '../api/validate-code';

export function useScannerValidation(
  renderModalContent: (state: ScannerState) => React.ReactNode,
) {
  const request = useScannerSessionStore((s) => s.request);
  const { showModal } = useModal();
  const [state, setState] = useState<ScannerState>({ status: 'idle' });
  const lockRef = useRef(false);
  const armTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showInstruction = useCallback(() => {
    showModal(renderModalContent(state));
  }, [renderModalContent, showModal, state]);

  const setStateAndUpdateModal = useCallback(
    (nextState: ScannerState) => {
      setState(nextState);
      showModal(renderModalContent(nextState));
    },
    [renderModalContent, showModal],
  );

  const armScanner = useCallback(() => {
    if (armTimeoutRef.current) {
      clearTimeout(armTimeoutRef.current);
    }

    armTimeoutRef.current = setTimeout(() => {
      armTimeoutRef.current = null;
    }, 350);
  }, []);

  const reset = useCallback(() => {
    lockRef.current = false;
    setState({
      status: 'idle',
    });

    armScanner();
  }, [armScanner]);

  const handleScan = useCallback(
    async (event: { data: string }) => {
      if (lockRef.current) return;
      lockRef.current = true;

      showModal(renderModalContent(state));

      if (!request) {
        const message = 'Данные для валидации не найдены';
        setStateAndUpdateModal({ status: 'error', message });
        return;
      }

      const { orderId, componentId, componentName, validBatches } =
        request.payload;
      setStateAndUpdateModal({ status: 'validating', data: event.data });

      try {
        const result = await validateCode({
          scannedCode: event.data,
          orderId,
          componentId,
          componentName,
          validBatches,
          deviceId: 'scanner-mobile',
          operatorId: 'Иван Иванович Иванов',
        });
        const { result: scanResult } = result;

        setStateAndUpdateModal({
          status: 'success',
          result: {
            scanResult,
            scannedComponentName: result.scannedComponentName,
            scannedComponentBatch: result.scannedComponentBatch,
          },
          data: event.data,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Code validation error.';
        console.error('Validation error:', error);

        setStateAndUpdateModal({ status: 'error', message, data: event.data });
      }
    },
    [renderModalContent, request, setStateAndUpdateModal, showModal, state],
  );

  return { state, handleScan, reset, showInstruction };
}
