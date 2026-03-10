export * from './bucket.dto.js';
export * from './filling-bucket-act.dto.js';
export * from './scan-event.dto.js';
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["OPEN"] = "OPEN";
    OrderStatus["IN_PROGRESS"] = "IN_PROGRESS";
    OrderStatus["CLOSED"] = "CLOSED";
})(OrderStatus || (OrderStatus = {}));
export var ScanResult;
(function (ScanResult) {
    ScanResult["OK"] = "OK";
    ScanResult["WRONG"] = "WRONG";
})(ScanResult || (ScanResult = {}));
//# sourceMappingURL=index.js.map