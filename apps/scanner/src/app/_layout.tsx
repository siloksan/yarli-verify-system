import { Stack } from 'expo-router';
import { SCANNER_ROUTES } from '@repo/api';
import { ModalProvider } from '../shared/modal';
import { Host } from 'react-native-portalize/lib/Host';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function RootProvider() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Host>
          <ModalProvider>
            <RootLayout />
          </ModalProvider>
        </Host>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'ЯрЛИ производство' }} />
      <Stack.Screen name="orders" options={{ headerShown: false }} />
      <Stack.Screen name="components" options={{ headerShown: false }} />
      <Stack.Screen name="containers" options={{ headerShown: false }} />
      <Stack.Screen name="filling-acts" options={{ headerShown: false }} />
      <Stack.Screen
        name={SCANNER_ROUTES.scanner.root}
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
