import { BucketQRData, IFillingActBucketResponseDto } from '@repo/api';

export const STEPS = {
  SCAN_BUCKET: 'SCAN_BUCKET',
  BUCKET_VALIDATING: 'BUCKET_VALIDATING',
  BUCKET_COMPLETED: 'BUCKET_COMPLETED',
  COMPONENT_VALIDATING: 'COMPONENT_VALIDATING',
  SCAN_COMPLETED: 'SCAN_COMPLETED',
  ERROR: 'ERROR',
} as const;

export type FillingStep = (typeof STEPS)[keyof typeof STEPS];

export const STEPS_DICTIONARY: Record<FillingStep, string> = {
  SCAN_BUCKET: 'Сканируйте код ёмкости для заполнения',
  BUCKET_VALIDATING: 'Данные отсканированной ёмкости проверяются в базе данных',
  BUCKET_COMPLETED: 'Ёмкость отсканированна',
  COMPONENT_VALIDATING:
    'Данные отсканированного компонента проверяются в базе данных',
  SCAN_COMPLETED: 'Акт заполнения ёмкости успешно создан, заполнение разрешено',
  ERROR: 'Ошибка сканирования',
};

// Non-error states
type NonErrorState =
  | { step: typeof STEPS.SCAN_BUCKET }
  | { step: typeof STEPS.BUCKET_COMPLETED; bucket: BucketQRData } // bucket scanned successfully
  | {
      step: typeof STEPS.COMPONENT_VALIDATING; // waiting for component validation
      bucket: BucketQRData;
      componentScanRequest: { barCode: string };
    }
  | {
      step: typeof STEPS.SCAN_COMPLETED; // all validations done
      fillingAct: IFillingActBucketResponseDto;
    };

// Full state including error
export type FillingState =
  | NonErrorState
  | { step: typeof STEPS.ERROR; message: string; prev: NonErrorState };
