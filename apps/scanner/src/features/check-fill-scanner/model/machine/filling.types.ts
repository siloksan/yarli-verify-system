import { BucketQRData, IFillingActBucketResponseDto } from '@repo/api';

export type FillingEvent =
  | { type: 'SCAN_BUCKET'; qrCode: string }
  | { type: 'BUCKET_VALIDATION_SUCCESS'; bucket: BucketQRData }
  | { type: 'BUCKET_VALIDATION_FAILURE'; message: string }
  | {
      type: 'SCAN_COMPONENT';
      barCode: string;
    }
  | {
      type: 'COMPONENT_VALIDATION_SUCCESS';
      fillingAct: IFillingActBucketResponseDto;
    }
  | {
      type: 'COMPONENT_VALIDATION_FAILURE';
      message: string;
    }
  | { type: 'RESET_ERROR' };
