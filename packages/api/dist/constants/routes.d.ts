export declare const SCANNER_ROUTES: {
    readonly scanner: {
        readonly root: "scanner";
        readonly check: "check";
        readonly check_and_fill: "check-and-fill";
        readonly fill_container: "fill-container";
    };
};
export type ScannerRoutes = (typeof SCANNER_ROUTES)[keyof typeof SCANNER_ROUTES];
export declare const API_ROUTES: {
    readonly batches: "batches";
    readonly components: "components";
    readonly orders: "orders";
    readonly SCAN_EVENTS: {
        readonly root: "scan-events";
        readonly barcode: "barcode";
        readonly qrCode: "qrcode";
    };
    readonly filling_act_buckets: "filling-act-buckets";
};
//# sourceMappingURL=routes.d.ts.map