import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { WebToAppMessage } from '@repo/api';
import {
  useScannerSessionStore,
  useWebViewBridgeStore,
} from '@/src/shared/stores';

// const WEB_CLIENT_URL = process.env.EXPO_PUBLIC_WEB_CLIENT_BASE_URL;
// const WEB_CLIENT_URL = 'http://172.24.96.1:5173';
const WEB_CLIENT_URL = 'http://192.168.0.52:5173';

export default function OrderRecipeWebView() {
  const webViewRef = useRef<WebView>(null);
  const setWebViewRef = useWebViewBridgeStore((s) => s.setWebViewRef);
  const router = useRouter();

  useEffect(() => {
    setWebViewRef(webViewRef.current);

    return () => {
      setWebViewRef(null);
    };
  }, []);

  const setRequest = useScannerSessionStore((s) => s.setRequest);
  const params = useLocalSearchParams();
  const orderId = params.orderId;

  const sourceUri = useMemo(() => {
    if (!WEB_CLIENT_URL || !orderId) {
      return undefined;
    }

    return `${WEB_CLIENT_URL}/orders/${orderId}`;
  }, [orderId]);

  const handleWebMessage = useCallback((event: WebViewMessageEvent) => {
    const parsed: WebToAppMessage = JSON.parse(event.nativeEvent.data);

    if (parsed.type !== 'SCAN_COMPONENT') {
      return;
    }

    setRequest(parsed.payload);
    router.push({
      pathname: `/scanner/check`,
    });
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

  return (
    <WebView
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
