import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Заказы на производство' }}
      />
      <Stack.Screen
        name="[orderId]"
        options={{ title: 'Заказ на производство' }}
      />
    </Stack>
  );
}
