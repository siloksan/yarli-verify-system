import { Prisma } from '../generated/prisma/client';
import {
  ComponentBatchCreateInput,
  RecipeComponentCreateInput,
} from 'generated/prisma/models';

export interface ComponentWithBatches {
  component: Omit<RecipeComponentCreateInput, 'id' | 'order'>;
  batches: Omit<ComponentBatchCreateInput, 'component'>[];
}

export const COMMON_COMPONENTS: ComponentWithBatches[] = [
  {
    component: {
      componentCode: 'TIO2-001',
      componentName: 'диоксид титана',
      requiredQty: new Prisma.Decimal(15.5),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-TIO2-BATCH-2024-01',
        batchNumber: 'BATCH-TIO2-2024-01',
        lotNumber: 'LOT-TIO2-001-24',
        expiresAt: new Date('2025-12-31'),
      },
      {
        qrCode: 'QR-TIO2-BATCH-2024-02',
        batchNumber: 'BATCH-TIO2-2024-02',
        lotNumber: 'LOT-TIO2-002-24',
        expiresAt: new Date('2025-12-31'),
      },
    ],
  },
  {
    component: {
      componentCode: 'FILLER-001',
      componentName: 'наполнитель',
      requiredQty: new Prisma.Decimal(8.2),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-FILLER-BATCH-2024-01',
        batchNumber: 'BATCH-FILLER-2024-01',
        lotNumber: 'LOT-FILLER-001-24',
        expiresAt: new Date('2025-06-30'),
      },
    ],
  },
  {
    component: {
      componentCode: 'DISPERSION-001',
      componentName: 'дисперсия',
      requiredQty: new Prisma.Decimal(25.0),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-DISPERSION-BATCH-2024-01',
        batchNumber: 'BATCH-DISPERSION-2024-01',
        lotNumber: 'LOT-DISPERSION-001-24',
        expiresAt: new Date('2024-12-31'),
      },
    ],
  },
  {
    component: {
      componentCode: 'DILUENT-001',
      componentName: 'разбавитель',
      requiredQty: new Prisma.Decimal(12.8),
      unit: 'л',
    },
    batches: [
      {
        qrCode: 'QR-DILUENT-BATCH-2024-01',
        batchNumber: 'BATCH-DILUENT-2024-01',
        lotNumber: 'LOT-DILUENT-001-24',
        expiresAt: new Date('2025-03-31'),
      },
    ],
  },
  {
    component: {
      componentCode: 'COALESCENT-001',
      componentName: 'коалесцент',
      requiredQty: new Prisma.Decimal(1.5),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-COALESCENT-BATCH-2024-01',
        batchNumber: 'BATCH-COALESCENT-2024-01',
        lotNumber: 'LOT-COALESCENT-001-24',
        expiresAt: new Date('2024-10-31'),
      },
    ],
  },
  {
    component: {
      componentCode: 'DEFOAMER-001',
      componentName: 'антивспениватель',
      requiredQty: new Prisma.Decimal(0.3),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-DEFOAMER-BATCH-2024-01',
        batchNumber: 'BATCH-DEFOAMER-2024-01',
        lotNumber: 'LOT-DEFOAMER-001-24',
        expiresAt: new Date('2024-09-30'),
      },
    ],
  },
  {
    component: {
      componentCode: 'DISPERSANT-001',
      componentName: 'диспергатор',
      requiredQty: new Prisma.Decimal(0.8),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-DISPERSANT-BATCH-2024-01',
        batchNumber: 'BATCH-DISPERSANT-2024-01',
        lotNumber: 'LOT-DISPERSANT-001-24',
        expiresAt: new Date('2024-11-30'),
      },
    ],
  },
  {
    component: {
      componentCode: 'THICKENER-001',
      componentName: 'загуститель',
      requiredQty: new Prisma.Decimal(0.5),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-THICKENER-BATCH-2024-01',
        batchNumber: 'BATCH-THICKENER-2024-01',
        lotNumber: 'LOT-THICKENER-001-24',
        expiresAt: new Date('2024-08-31'),
      },
    ],
  },
];

export const COLOR_COMPONENTS: Record<string, ComponentWithBatches> = {
  white: {
    component: {
      componentCode: 'WHITE-PIGMENT',
      componentName: 'диоксид титана (пигмент)',
      requiredQty: new Prisma.Decimal(20.0),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-WHITE-PIGMENT-BATCH-2024-01',
        batchNumber: 'BATCH-WHITE-PIGMENT-2024-01',
        lotNumber: 'LOT-WHITE-PIGMENT-001-24',
        expiresAt: new Date('2026-01-31'),
      },
    ],
  },
  red: {
    component: {
      componentCode: 'RED-PIGMENT-001',
      componentName: 'красный пигмент',
      requiredQty: new Prisma.Decimal(3.2),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-RED-PIGMENT-BATCH-2024-01',
        batchNumber: 'BATCH-RED-PIGMENT-2024-01',
        lotNumber: 'LOT-RED-PIGMENT-001-24',
        expiresAt: new Date('2025-08-31'),
      },
      {
        qrCode: 'QR-RED-PIGMENT-BATCH-2024-02',
        batchNumber: 'BATCH-RED-PIGMENT-2024-02',
        lotNumber: 'LOT-RED-PIGMENT-002-24',
        expiresAt: new Date('2025-08-31'),
      },
    ],
  },
  blue: {
    component: {
      componentCode: 'BLUE-PIGMENT-001',
      componentName: 'синий пигмент',
      requiredQty: new Prisma.Decimal(2.8),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-BLUE-PIGMENT-BATCH-2024-01',
        batchNumber: 'BATCH-BLUE-PIGMENT-2024-01',
        lotNumber: 'LOT-BLUE-PIGMENT-001-24',
        expiresAt: new Date('2025-07-31'),
      },
    ],
  },
  black: {
    component: {
      componentCode: 'BLACK-PIGMENT-001',
      componentName: 'чёрный пигмент',
      requiredQty: new Prisma.Decimal(1.5),
      unit: 'кг',
    },
    batches: [
      {
        qrCode: 'QR-BLACK-PIGMENT-BATCH-2024-01',
        batchNumber: 'BATCH-BLACK-PIGMENT-2024-01',
        lotNumber: 'LOT-BLACK-PIGMENT-001-24',
        expiresAt: new Date('2025-09-30'),
      },
      {
        qrCode: 'QR-BLACK-PIGMENT-BATCH-2023-12',
        batchNumber: 'BATCH-BLACK-PIGMENT-2023-12',
        lotNumber: 'LOT-BLACK-PIGMENT-012-23',
        expiresAt: new Date('2024-12-31'),
      },
    ],
  },
};
