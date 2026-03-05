import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { WEB_CLIENT_URL } from '@/src/shared/constants/environments.constants';
import { useRef, useState } from 'react';
import { createWebPath } from '@/src/shared/helpers';

const webSourceUrl = `${WEB_CLIENT_URL}/components`;

export default function MainMenu() {
  const webViewRef = useRef<WebView>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);

    setHasError(true);

    if (nativeEvent.description?.includes('net::ERR_CONNECTION_REFUSED')) {
      setErrorMessage(
        'Не удается подключиться к серверу. Проверьте, запущен ли веб-клиент.',
      );
    } else if (
      nativeEvent.description?.includes('net::ERR_INTERNET_DISCONNECTED')
    ) {
      setErrorMessage('Нет подключения к интернету. Проверьте настройки сети.');
    } else if (
      nativeEvent.description?.includes('net::ERR_CONNECTION_TIMEOUT')
    ) {
      setErrorMessage(
        'Время ожидания подключения истекло. Сервер не отвечает.',
      );
    } else {
      setErrorMessage(
        'Не удалось загрузить страницу. Пожалуйста, попробуйте позже.',
      );
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');

    // Reload the webview
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleLoadStart = () => {
    setHasError(false);
  };

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Ошибка подключения</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={{ uri: createWebPath(webSourceUrl) }}
        onError={handleError}
        onHttpError={handleError}
        onLoadStart={handleLoadStart}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Загрузка...</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
