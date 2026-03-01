import { BucketQRData, IFillingActBucketResponseDto } from '@repo/api';

export type FillingEffect =
  | { type: 'SHOW_SCANNER_PROGRESS' }
  | { type: 'VALIDATE_BUCKET'; qrCode: string }
  | { type: 'SHOW_BUCKET_SUCCESS'; bucket: BucketQRData }
  | { type: 'SHOW_BUCKET_ERROR'; message: string }
  | { type: 'VALIDATE_COMPONENT'; barCode: string; bucket: BucketQRData }
  | { type: 'SHOW_COMPONENT_SUCCESS'; fillingAct: IFillingActBucketResponseDto }
  | { type: 'SHOW_COMPONENT_ERROR'; message: string };
