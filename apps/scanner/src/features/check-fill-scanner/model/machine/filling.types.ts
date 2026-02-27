import {
  BucketQRData,
  ICreateFillingActBucketDto,
  IFillingActBucketResponseDto,
} from '@repo/api';

export interface BucketValidationData {
  bucketCode: string;
  testedComponentName: string;
}

export type FillingState =
  | { step: 'scan_bucket' }
  | { step: 'bucket_completed'; bucket: BucketQRData }
  | {
      step: 'component_validating';
      bucket: BucketQRData;
      createScanEventData: ICreateFillingActBucketDto;
    }
  | {
      step: 'scan_completed';
      fillingAct: IFillingActBucketResponseDto;
    }
  | { step: 'error'; message: string; prev: FillingState };
