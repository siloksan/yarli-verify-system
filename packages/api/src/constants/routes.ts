export const SCANNER_ROUTES = {
  scanner_check: 'scanner/check',
  scanner_check_and_fill: 'scanner/check-and-fill',
  scanner_fill_container: 'scanner/fill-container',
} as const;

export type ScannerRoutes =
  (typeof SCANNER_ROUTES)[keyof typeof SCANNER_ROUTES];

export const API_ROUTES = {
  batches: 'batches',
  components: 'components',
  orders: 'orders',
  SCAN_EVENTS: {
    root: 'scan-events',
    barcode: 'barcode',
    qrCode: 'qrcode',
  },
  filling_act_buckets: 'filling-act-buckets',
} as const;
