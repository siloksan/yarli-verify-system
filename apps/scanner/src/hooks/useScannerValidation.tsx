import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { validateCode } from '../api/validate-code';

import { useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { ScannerCheckParams, ScanResult } from '@repo/api';

const RESET_DELAY_MS = 1500;


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
  const timeoutRef = useRef<number | null>(null);

  const deepLinkParams = useMemo(() => {
    return {
      orderId: getParamValue(params.orderId),
      componentId: getParamValue(params.componentId),
      componentName: getParamValue(params.componentName),
      validBatches: parseValidBatches(
        getParamValue(params.validBatches),
      ),
      callback: getParamValue(params.callback),
    };
  }, [params]);

  const reset = useCallback(() => {
    lockRef.current = false;
    setState({ status: 'idle' });
  }, []);


  const handleScan = useCallback(
    async (event: { data: string }) => {
      if (lockRef.current) return;
      lockRef.current = true;

      const { orderId, componentId, componentName, validBatches, callback } =
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

        if (result.scanResult !== ScanResult.OK) {
        }

        if (callback) {

          const callbackUrl = new URL(callback);
          callbackUrl.searchParams.set('scanResult', result.scanResult);
          callbackUrl.searchParams.set('componentId', componentId);
          callbackUrl.searchParams.set(
            'scannedBatch',
            result.scannedComponentBatch,
          );
          callbackUrl.searchParams.set('scannedCode', event.data);

          // await Linking.openURL(callbackUrl.toString());
        }
  
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Code validation error.';

        setState({ status: 'error', message, data: event.data });

        if (deepLinkParams.callback && deepLinkParams.componentId) {
          try {
            // validateCallbackUrl(deepLinkParams.callback);

            const callbackUrl = new URL(deepLinkParams.callback);
            callbackUrl.searchParams.set('scanError', message);
            callbackUrl.searchParams.set(
              'componentId',
              deepLinkParams.componentId,
            );

            // await Linking.openURL(callbackUrl.toString());
          } catch {}
        }

      }
    },
    [deepLinkParams],
  );

  return { state, handleScan, reset };
}
