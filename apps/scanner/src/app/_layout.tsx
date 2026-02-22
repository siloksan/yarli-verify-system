import { Stack } from 'expo-router';
import { SCANNER_ROUTES } from '@repo/api';
import { ModalProvider } from '../shared/modal';
import { Host } from 'react-native-portalize/lib/Host';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootProvider() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Host>
        <ModalProvider>
          <RootLayout />
        </ModalProvider>
      </Host>
    </GestureHandlerRootView>
  );
}

export function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen
        name={SCANNER_ROUTES.scanner_check}
        options={{ title: 'Сканируйте компонент' }}
      />
      <Stack.Screen
        name={SCANNER_ROUTES.scanner_check_and_fill}
        options={{ title: 'Сканирование и заполнение' }}
      />
      <Stack.Screen
        name="order-recipe/index"
        options={{ title: 'Рецептура заказа' }}
      />
    </Stack>
  );
}
