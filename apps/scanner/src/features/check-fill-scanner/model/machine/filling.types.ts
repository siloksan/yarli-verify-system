import { BucketQRData, IFillingActBucketResponseDto } from '@repo/api';

// export interface BucketValidationData {
//   bucketCode: string;
//   testedComponentName: string;
// }

// export type FillingState =
//   | { step: 'scan_bucket' }
//   | { step: 'bucket_completed'; bucket: BucketQRData }
//   | {
//       step: 'component_validating';
//       bucket: BucketQRData;
//       createScanEventData: ICreateFillingActBucketDto;
//     }
//   | {
//       step: 'scan_completed';
//       fillingAct: IFillingActBucketResponseDto;
//     }
//   | { step: 'error'; message: string; prev: FillingState };

// filling.events.ts

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
