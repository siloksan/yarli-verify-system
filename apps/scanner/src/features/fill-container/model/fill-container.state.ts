import {
  BucketQRData,
  IBucketResponseDto,
  IFillingContainerActResponseDto,
} from '@repo/api';

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

export type FillingState =
  | { step: typeof STEPS.SCAN_BUCKET }
  | { step: typeof STEPS.BUCKET_VALIDATING; bucketQr: BucketQRData }
  | { step: typeof STEPS.BUCKET_COMPLETED; bucketData: IBucketResponseDto }
  | {
      step: typeof STEPS.COMPONENT_VALIDATING;
      bucketData: IBucketResponseDto;
      barCode: string;
    }
  | {
      step: typeof STEPS.SCAN_COMPLETED;
      bucketData: IBucketResponseDto;
      fillingAct: IFillingContainerActResponseDto;
    }
  | { step: typeof STEPS.ERROR };

export type ErrorState = {
  message: string;
  prev: FillingState;
} | null;
