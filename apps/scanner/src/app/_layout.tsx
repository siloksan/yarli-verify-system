import { Stack } from 'expo-router';
import { SCANNER_ROUTES } from '@repo/api';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen
        name={SCANNER_ROUTES.scanner_check}
        options={{ title: 'Сканирование' }}
      />
      <Stack.Screen
        name={SCANNER_ROUTES.scanner_check_and_fill}
        options={{ title: 'Сканирование' }}
      />
      <Stack.Screen
        name="order-recipe/index"
        options={{ title: 'Рецептура заказа' }}
      />
    </Stack>
  );
}
