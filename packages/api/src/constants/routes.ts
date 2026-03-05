export const SCANNER_ROUTES = {
  scanner: {
    root: 'scanner',
    check: 'check',
    check_and_fill: 'check-and-fill',
    fill_container: 'fill-container',
  },
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
