import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { SCANNER_ROUTES, WEB_TO_APP_MESSAGE_TYPES } from '@repo/api';
import {
  useScannerSessionStore,
  useWebViewBridgeStore,
} from '@/src/shared/stores';
import { WEB_CLIENT_URL } from '@/src/shared/constants/environments.constants';

export default function OrderRecipeWebView() {
  const webViewRef = useRef<WebView>(null);
  const [webViewKey, setWebViewKey] = useState(0);
  const setWebViewRef = useWebViewBridgeStore((s) => s.setWebViewRef);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setWebViewKey((prev) => prev + 1);
    }, []),
  );

  useEffect(() => {
    setWebViewRef(webViewRef.current);

    return () => {
      setWebViewRef(null);
    };
  }, [setWebViewRef, webViewKey]);

  const setRequest = useScannerSessionStore((s) => s.setRequest);
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  const sourceUri = useMemo(() => {
    if (!WEB_CLIENT_URL || !orderId) {
      return undefined;
    }

    return `${WEB_CLIENT_URL}/orders/${orderId}`;
  }, [orderId]);

  const handleWebMessage = useCallback((event: WebViewMessageEvent) => {
    const parsed = JSON.parse(event.nativeEvent.data);

    if (!Object.values(WEB_TO_APP_MESSAGE_TYPES).includes(parsed.type)) {
      return;
    }

    setRequest(parsed);
    switch (parsed.type) {
      case WEB_TO_APP_MESSAGE_TYPES.SCAN_COMPONENT:
        router.push({
          pathname: `/${SCANNER_ROUTES.scanner_check}`,
        });
        break;
      case WEB_TO_APP_MESSAGE_TYPES.FILLING_BUCKET_ACT:
        router.push({
          pathname: `/${SCANNER_ROUTES.scanner_check_and_fill}`,
        });
        break;
      default:
        break;
    }
  }, []);

  if (!WEB_CLIENT_URL || !sourceUri) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          Missing EXPO_PUBLIC_WEB_CLIENT_BASE_URL or orderId parameter.
        </Text>
      </View>
    );
  }

  // key use only for prototype flow to reset webview state when navigate back from scanner screen. In real app we should handle this via postMessage and not reset whole webview
  return (
    <WebView
      key={webViewKey}
      ref={webViewRef}
      style={styles.container}
      source={{ uri: sourceUri }}
      onMessage={handleWebMessage}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
