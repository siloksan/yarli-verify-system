import { BucketQRData, IFillingActBucketResponseDto } from '@repo/api';

// Non-error states
type NonErrorState =
  | { step: 'SCAN_BUCKET' }
  | { step: 'BUCKET_COMPLETED'; bucket: BucketQRData } // bucket scanned successfully
  | {
      step: 'COMPONENT_VALIDATING'; // waiting for component validation
      bucket: BucketQRData;
      componentScanRequest: { barCode: string };
    }
  | {
      step: 'SCAN_COMPLETED'; // all validations done
      fillingAct: IFillingActBucketResponseDto;
    };

// Full state including error
export type FillingState =
  | NonErrorState
  | { step: 'ERROR'; message: string; prev: NonErrorState };
