import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('pages/main.tsx'),
  route('orderPage', 'pages/orders.tsx'),
  route('orderPage/:orderId', 'pages/order-recipe.tsx'),
  route('componentsPage', 'pages/components.tsx'),
  route('unsupported', 'pages/unsupported-page.tsx'),
] satisfies RouteConfig;
