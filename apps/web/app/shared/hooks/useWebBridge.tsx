import { useMemo } from 'react';
import { sendMessageToApp } from '../utils';

export function useNativeFeatures() {
  const isNative =
    typeof window !== 'undefined' &&
    typeof window.ReactNativeWebView !== 'undefined';

  return useMemo(() => {
    if (!isNative) return null;

    return {
      sendMessageToApp,
    };
  }, [isNative]);
}
