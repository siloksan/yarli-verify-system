// import { BucketValidationData, FillingState } from './filling.types';
// import {
//   BucketQRData,
//   ICreateFillingActBucketDto,
//   IFillingActBucketResponseDto,
// } from '@repo/api';

// export const FillingMachine = {
//   initial(): FillingState {
//     return { step: 'scan_bucket' };
//   },

//   bucketValidated(bucket: BucketQRData): FillingState {
//     return { step: 'bucket_completed', bucket };
//   },

//   startComponentValidation(
//     createScanEventData: ICreateFillingActBucketDto,
//     bucket: BucketQRData,
//   ): FillingState {
//     return { step: 'component_validating', createScanEventData, bucket };
//   },

//   componentValidated(fillingAct: IFillingActBucketResponseDto): FillingState {
//     return { step: 'scan_completed', fillingAct };
//   },

//   fail(message: string, prev: FillingState): FillingState {
//     return { step: 'error', message, prev };
//   },

//   retry(prev: FillingState): FillingState {
//     return prev;
//   },
// };
