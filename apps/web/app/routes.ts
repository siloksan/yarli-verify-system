import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('pages/orders.tsx'),
  route(
    'orders/:orderId/components/:componentId/scan',
    'pages/component-scan.tsx',
  ),
  route('orders/:orderId', 'pages/order-recipe.tsx'),
  route('unsupported', 'pages/unsupported-page.tsx'),
] satisfies RouteConfig;
