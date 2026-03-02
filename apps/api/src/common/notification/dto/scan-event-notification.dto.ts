export interface ScanEventWithOrderNotification {
  scanEventId: string;
  orderBatch: string;
  orderName: string;
  recipeComponentName: string;
  scannedComponentName: string;
  scannedComponentBatch: string | null;
  workerName: string;
  deviceName: string;
  createdAt: Date;
}
