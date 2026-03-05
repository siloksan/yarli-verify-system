import { SCANNER_ROUTES } from '@repo/api';
import { Stack } from 'expo-router';

export default function ScannerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name={SCANNER_ROUTES.scanner.check}
        options={{ title: 'Назад к рецептуре' }}
      />
      <Stack.Screen
        name={SCANNER_ROUTES.scanner.check_and_fill}
        options={{ title: 'Назад к рецептуре' }}
      />
      <Stack.Screen
        name={SCANNER_ROUTES.scanner.fill_container}
        options={{ title: 'В главное меню' }}
      />
    </Stack>
  );
}
