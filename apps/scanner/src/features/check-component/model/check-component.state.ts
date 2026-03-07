// import {
//   BucketQRData,
//   IBucketResponseDto,
//   IFillingContainerActResponseDto,
// } from '@repo/api';

import { IScanEvent } from '@repo/api';

export const STEPS = {
  SCAN_COMPONENT: 'SCAN_COMPONENT',
  COMPONENT_VALIDATING: 'COMPONENT_VALIDATING',
  SCAN_COMPLETED: 'SCAN_COMPLETED',
  ERROR: 'ERROR',
} as const;

export type ScanComponentStep = (typeof STEPS)[keyof typeof STEPS];

export const STEPS_DICTIONARY: Record<ScanComponentStep, string> = {
  SCAN_COMPONENT: 'Сканируйте код компонента для проверки',
  COMPONENT_VALIDATING:
    'Данные отсканированного компонента проверяются в базе данных',
  SCAN_COMPLETED: 'Акт заполнения ёмкости успешно создан, заполнение разрешено',
  ERROR: 'Ошибка сканирования',
};

export type ScanComponentState =
  | { step: typeof STEPS.SCAN_COMPONENT }
  | { step: typeof STEPS.COMPONENT_VALIDATING }
  | {
      step: typeof STEPS.SCAN_COMPLETED;
      scanEvent: IScanEvent;
    }
  | { step: typeof STEPS.ERROR };

export type ErrorState = {
  message: string;
  prev: ScanComponentState;
} | null;
