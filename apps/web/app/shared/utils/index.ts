import type { WebToAppMessage } from '@repo/api';

export function sendMessageToApp(message: WebToAppMessage) {
  window.ReactNativeWebView!.postMessage(JSON.stringify(message));
}
