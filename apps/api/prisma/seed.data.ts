import { Prisma, Component, ComponentBatch } from '../generated/prisma/client';
export interface SeedComponent {
  componentCode: string;
  componentName: string;
  requiredQty: Prisma.Decimal;
  unit?: string;
}

export interface SeedBatch {
  batchNumber: string;
  expiresAt?: Date;
  qrCode?: string;
}

export interface ComponentWithBatches {
  component: SeedComponent;
  batches: SeedBatch[];
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
      componentCode: 'FILLER-001',
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
  {
    component: {
      componentCode: 'DISPERSION-001',
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
      componentCode: 'DILUENT-001',
      componentName: 'разбавитель',
      requiredQty: new Prisma.Decimal(12.8),
      unit: 'л',
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
      componentCode: 'COALESCENT-001',
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
      componentCode: 'DEFOAMER-001',
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
      componentCode: 'DISPERSANT-001',
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
      componentCode: 'THICKENER-001',
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
        batchNumber: 'П2500010',
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
      componentCode: 'BLUE-PIGMENT-001',
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
      componentCode: 'BLACK-PIGMENT-001',
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

export const BASE_COMPONENT: Partial<Component> & {
  batches: Partial<ComponentBatch>[];
} = {
  code: 'component-code-001',
  name: 'компонент-1',
  batches: [
    {
      batchNumber: 'П2501001',
      expiresAt: new Date('2025-12-31'),
    },
    {
      batchNumber: 'П2501002',
      expiresAt: new Date('2025-12-31'),
    },
  ],
};
