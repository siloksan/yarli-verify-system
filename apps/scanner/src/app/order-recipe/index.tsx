import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { type ScannerCheckParams, type ScannerRoutes } from '@repo/api';

type NativeWebMessage = {
  type: 'OPEN_SCANNER';
  payload: {
    route?: ScannerRoutes;
    orderId?: string;
    componentId?: string;
    componentName?: string;
    validBatches?: string[];
    callback?: string;
  };
};

const WEB_CLIENT_URL = process.env.EXPO_PUBLIC_WEB_CLIENT_BASE_URL;

const getParamValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default function OrderRecipeWebView() {
  const webViewRef = useRef<WebView>(null);
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string;
    componentId?: string;
    scanResult?: string;
    scannedBatch?: string;
  }>();

  const orderId = getParamValue(params.orderId);
  const componentId = getParamValue(params.componentId);
  const scanResult = getParamValue(params.scanResult);
  const scannedBatch = getParamValue(params.scannedBatch);

  const sourceUri = useMemo(() => {
    if (!WEB_CLIENT_URL || !orderId) {
      return undefined;
    }

    return `${WEB_CLIENT_URL}/orders/${orderId}`;
  }, [orderId]);

  const scanEventPayload = useMemo(
    () => ({
      type: 'SCAN_RESULT',
      payload: {
        scanResult,
        componentId,
        scannedBatch,
      },
    }),
    [componentId, scanResult, scannedBatch],
  );

  const emitScanResultToWeb = useCallback(() => {
    if (!webViewRef.current || !scanResult || !componentId) {
      return;
    }

    const detail = JSON.stringify(scanEventPayload);
    webViewRef.current.injectJavaScript(
      `window.dispatchEvent(new CustomEvent('native-scan-result', { detail: ${detail} })); true;`,
    );
  }, [componentId, scanEventPayload, scanResult]);

  const handleWebMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const parsed: NativeWebMessage = JSON.parse(event.nativeEvent.data);

        if (parsed.type !== 'OPEN_SCANNER') {
          return;
        }

        const route = parsed.payload.route ?? 'scanner/check';
        const scannerParams: ScannerCheckParams = {
          orderId: parsed.payload.orderId ?? '',
          componentId: parsed.payload.componentId ?? '',
          componentName: parsed.payload.componentName ?? '',
          callback: parsed.payload.callback ?? '',
          validBatches: parsed.payload.validBatches,
        };

        router.push({
          pathname: `/${route}`,
          params: {
            orderId: scannerParams.orderId,
            componentId: scannerParams.componentId,
            componentName: scannerParams.componentName,
            callback: scannerParams.callback,
            validBatches: JSON.stringify(scannerParams.validBatches ?? []),
          },
        });
      } catch {
        // Ignore malformed messages from web layer.
      }
    },
    [router],
  );

  if (!WEB_CLIENT_URL || !sourceUri) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          Missing EXPO_PUBLIC_WEB_CLIENT_BASE_URL or orderId parameter.
        </Text>
      </View>
    );
  }

  return (
    <WebView
      ref={webViewRef}
      style={styles.container}
      source={{ uri: sourceUri }}
      onLoadEnd={emitScanResultToWeb}
      onMessage={handleWebMessage}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fallbackText: {
    textAlign: 'center',
    color: '#111827',
  },
});
