import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('pages/main.tsx'),
  route('orders', 'pages/orders.tsx'),
  route('closed-orders', 'pages/closed-orders.tsx'),
  route('orders/:orderId', 'pages/order-recipe.tsx'),
  route('components', 'pages/components.tsx'),
  route('unsupported', 'pages/unsupported-page.tsx'),
  route('buckets', 'pages/bucket.tsx'),
] satisfies RouteConfig;
