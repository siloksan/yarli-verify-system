import { BucketQRData, IFillingActBucketResponseDto } from '@repo/api';

type NonErrorState =
  | { step: 'SCAN_BUCKET' }
  | { step: 'BUCKET_VALIDATING'; bucket: BucketQRData }
  | { step: 'BUCKET_COMPLETED'; bucketId: BucketQRData['id'] }
  | {
      step: 'COMPONENT_VALIDATING';
      bucket: BucketQRData;
      componentScanRequest: { barCode: string };
    }
  | {
      step: 'SCAN_COMPLETED';
      bucket: BucketQRData;
      fillingAct: IFillingActBucketResponseDto;
    };

export type FillContainerState =
  | NonErrorState
  | { step: 'ERROR'; message: string; prev: NonErrorState };
