import { Prisma } from '../generated/prisma/client';
export interface SeedComponent {
  componentName: string;
  requiredQty: Prisma.Decimal;
  unit?: string;
}

export interface SeedBatch {
  batchNumber: string;
  expiresAt?: Date;
}

export interface ComponentWithBatches {
  component: SeedComponent;
  batches: SeedBatch[];
}

export const COMMON_COMPONENTS: ComponentWithBatches[] = [
  {
    component: {
      componentName: 'дисперсия',
      requiredQty: new Prisma.Decimal(25.0),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500004',
        expiresAt: new Date('2024-12-31'),
      },
    ],
  },
  {
    component: {
      componentName: 'коалесцент',
      requiredQty: new Prisma.Decimal(1.5),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500006',
        expiresAt: new Date('2024-10-31'),
      },
    ],
  },
  {
    component: {
      componentName: 'разбавитель',
      requiredQty: new Prisma.Decimal(12.8),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500005',
        expiresAt: new Date('2025-03-31'),
      },
    ],
  },
  {
    component: {
      componentName: 'антивспениватель',
      requiredQty: new Prisma.Decimal(0.3),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500007',
        expiresAt: new Date('2024-09-30'),
      },
    ],
  },
  {
    component: {
      componentName: 'диспергатор',
      requiredQty: new Prisma.Decimal(0.8),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500008',
        expiresAt: new Date('2024-11-30'),
      },
    ],
  },
  {
    component: {
      componentName: 'загуститель',
      requiredQty: new Prisma.Decimal(0.5),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500009',
        expiresAt: new Date('2024-08-31'),
      },
    ],
  },
  {
    component: {
      componentName: 'диоксид титана',
      requiredQty: new Prisma.Decimal(15.5),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500001',
        expiresAt: new Date('2025-12-31'),
      },
      {
        batchNumber: 'П2500002',
        expiresAt: new Date('2025-12-31'),
      },
    ],
  },
  {
    component: {
      componentName: 'наполнитель',
      requiredQty: new Prisma.Decimal(8.2),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500003',
        expiresAt: new Date('2025-06-30'),
      },
    ],
  },
];

export const COLOR_COMPONENTS: Record<string, ComponentWithBatches> = {
  white: {
    component: {
      componentName: 'диоксид титана (пигмент)',
      requiredQty: new Prisma.Decimal(20.0),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500010',
        expiresAt: new Date('2026-01-31'),
      },
    ],
  },
  red: {
    component: {
      componentName: 'красный пигмент',
      requiredQty: new Prisma.Decimal(3.2),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500011',
        expiresAt: new Date('2025-08-31'),
      },
      {
        batchNumber: 'П2500012',
        expiresAt: new Date('2025-08-31'),
      },
    ],
  },
  blue: {
    component: {
      componentName: 'синий пигмент',
      requiredQty: new Prisma.Decimal(2.8),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500013',
        expiresAt: new Date('2025-07-31'),
      },
    ],
  },
  black: {
    component: {
      componentName: 'чёрный пигмент',
      requiredQty: new Prisma.Decimal(1.5),
      unit: 'кг',
    },
    batches: [
      {
        batchNumber: 'П2500014',
        expiresAt: new Date('2025-09-30'),
      },
      {
        batchNumber: 'П2500015',
        expiresAt: new Date('2024-12-31'),
      },
    ],
  },
};
