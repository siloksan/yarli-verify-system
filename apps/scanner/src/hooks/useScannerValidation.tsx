import { useCallback, useMemo, useRef, useState } from 'react';
import { validateCode } from '../api/validate-code';

import { ScannerCheckParams, ScanResult } from '@repo/api';
import { useFocusEffect } from 'expo-router';

type ValidationResultState = {
  scanResult: ScanResult;
  scannedComponentBatch: string;
};

type ScannerState =
  | { status: 'idle' }
  | { status: 'validating'; data: string }
  | { status: 'success'; result: ValidationResultState; data: string }
  | { status: 'error'; message: string; data?: string };

const getParamValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const parseValidBatches = (value?: string) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((batch): batch is string => typeof batch === 'string')
      : [];
  } catch {
    return [];
  }
}

export function useScannerValidation(params:ScannerCheckParams) {
  const [state, setState] = useState<ScannerState>({ status: 'idle' });
  const lockRef = useRef(false);
  const canScanRef = useRef(false);
  const armTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deepLinkParams = useMemo(() => {
    return {
      orderId: getParamValue(params.orderId),
      componentId: getParamValue(params.componentId),
      componentName: getParamValue(params.componentName),
      validBatches: parseValidBatches(
        getParamValue(params.validBatches),
      ),
    };
  }, [params]);

  const armScanner = useCallback(() => {
    canScanRef.current = false;
    if (armTimeoutRef.current) {
      clearTimeout(armTimeoutRef.current);
    }

    // Ignore stale camera events right after returning to scanner screen.
    armTimeoutRef.current = setTimeout(() => {
      canScanRef.current = true;
      armTimeoutRef.current = null;
    }, 350);
  }, []);

  const reset = useCallback(() => {
    lockRef.current = false;
    setState({ status: 'idle' });
    armScanner();
  }, [armScanner]);

  useFocusEffect(
    useCallback(() => {
      reset();
      return () => {
        canScanRef.current = false;
        if (armTimeoutRef.current) {
          clearTimeout(armTimeoutRef.current);
          armTimeoutRef.current = null;
        }
      };
    }, [reset]),
  );


  const handleScan = useCallback(
    async (event: { data: string }) => {
      if (!canScanRef.current || lockRef.current) return;
      lockRef.current = true;

      const { orderId, componentId, componentName, validBatches } =
        deepLinkParams;

      if (!orderId || !componentId || !componentName) {
        setState({
          status: 'error',
          message: 'Попробуйте отсканировать код снова. Отсутствуют необходимые параметры для указанного компонента. При повторной ошибке обратитесь в поддержку.',
        });
        return;
      }

      setState({ status: 'validating', data: event.data });

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

        setState({
          status: 'success',
          result: {
            scanResult: result.scanResult,
            scannedComponentBatch: result.scannedComponentBatch,
          },
          data: event.data,
        });
  
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Code validation error.';

        setState({ status: 'error', message, data: event.data });

      }
    },
    [deepLinkParams],
  );

  return { state, handleScan, reset };
}
