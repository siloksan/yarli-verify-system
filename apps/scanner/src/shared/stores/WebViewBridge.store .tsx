import { create } from 'zustand';
import type { WebView } from 'react-native-webview';

interface WebViewBridgeState {
  webViewRef: WebView | null;
  setWebViewRef: (ref: WebView | null) => void;
}

export const useWebViewBridgeStore = create<WebViewBridgeState>((set) => ({
  webViewRef: null,
  setWebViewRef: (ref) => set({ webViewRef: ref }),
}));
