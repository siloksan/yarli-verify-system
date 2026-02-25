export const SCANNER_ROUTES = {
  scanner_check: 'scanner/check',
  scanner_check_and_fill: 'scanner/check-and-fill',
} as const;

export type ScannerRoutes =
  (typeof SCANNER_ROUTES)[keyof typeof SCANNER_ROUTES];

export const API_ROUTES = {
  batches: 'batches',
  components: 'components',
  orders: 'orders',
  scan_events: 'scan-events',
  filling_act_buckets: 'filling-act-buckets',
} as const;
