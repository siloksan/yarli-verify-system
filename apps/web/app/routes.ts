import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index('pages/orders.tsx'),
  route('orders/:orderId', 'pages/order-details.tsx')
] satisfies RouteConfig;
