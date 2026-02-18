import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import 'dotenv/config';
import { COMMON_COMPONENTS, COLOR_COMPONENTS } from './seed.data';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type OrderSeed = {
  orderNumber: string;
  label: string;
  description?: string;
  plannedAt?: Date;
};

const ORDERS: OrderSeed[] = [
  {
    orderNumber: 'В500001',
    label: 'ВД-АК-1308 база',
    description: 'Standard batch for indoor coating.',
    plannedAt: new Date('2026-02-10'),
  },
  {
    orderNumber: 'В500023',
    label: 'ВД-АК-1308 белая',
    description: 'Weather-resistant formulation.',
    plannedAt: new Date('2026-02-11'),
  },
  {
    orderNumber: 'В500123',
    label: 'ВД-АК-1308 красная',
    description: 'High-adhesion primer mix.',
    plannedAt: new Date('2026-02-12'),
  },
  {
    orderNumber: 'В500433',
    label: 'ВД-АК-1308 синяя',
    description: 'Low-VOC interior blend.',
    plannedAt: new Date('2026-02-13'),
  },
  {
    orderNumber: 'В500021',
    label: 'ВД-АК-1308 чёрная',
    description: 'Durable matte finish.',
    plannedAt: new Date('2026-02-14'),
  },
];

async function seed() {
  // Start clean so unique constraints don't fail.
  await prisma.scanEvent.deleteMany();
  await prisma.componentBatch.deleteMany();
  await prisma.recipeComponent.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.component.deleteMany();

  const allComponents = [
    ...COMMON_COMPONENTS,
    ...Object.values(COLOR_COMPONENTS),
  ];
  const generatedComponents = generateNewComponents();

  for (const item of allComponents) {
    const created = await prisma.component.create({
      data: {
        name: item.component.componentName,
      },
      select: { id: true },
    });

    if (item.batches.length > 0) {
      await prisma.componentBatch.createMany({
        data: item.batches.map((batch) => {
          return {
            componentId: created.id,
            batchNumber: batch.batchNumber,
            barcode: getBarCodeEAN13ForComponent(batch.batchNumber),
            expiresAt: batch.expiresAt,
          };
        }),
        skipDuplicates: true,
      });
    }
  }

  for (const item of generatedComponents) {
    const created = await prisma.component.create({
      data: {
        name: item.name,
      },
      select: { id: true },
    });

    if (item.batches.length > 0) {
      await prisma.componentBatch.createMany({
        data: item.batches.map((batch) => ({
          componentId: created.id,
          batchNumber: batch.batchNumber,
          barcode: getBarCodeEAN13ForComponent(batch.batchNumber),
          expiresAt: batch.expiresAt,
        })),
        skipDuplicates: true,
      });
    }
  }

  for (const element of ORDERS) {
    const order = element;
    const components = COMMON_COMPONENTS.map((item, index) => ({
      componentName: item.component.componentName,
      position: index + 1,
      requiredQty: item.component.requiredQty,
      unit: item.component.unit,
      validBatches: [],
    }));

    if (components.length !== 8) {
      throw new Error(
        `Expected 8 components per order, got ${components.length}`,
      );
    }

    await prisma.productionOrder.create({
      data: {
        orderNumber: order.orderNumber,
        label: order.label,
        plannedAt: order.plannedAt,
        components: {
          create: components,
        },
      },
    });
  }
}

const AMOUNT_OF_COMPONENTS = 999;
let batchNumber = 1;

function getNewBatch() {
  return {
    batchNumber: `П250100${batchNumber++}`,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
}

function generateNewComponents() {
  const newComponents: Array<{
    code: string;
    name: string;
    batches: Array<{ batchNumber: string; expiresAt: Date }>;
  }> = [];

  for (let i = 0; i < AMOUNT_OF_COMPONENTS; i++) {
    const batches = Array.from({ length: Math.floor(Math.random() * 5) }, () =>
      getNewBatch(),
    );
    const newComponent = {
      code: `component-code-00-${i}`,
      name: `компонент-${i}`,
      batches,
    };

    newComponents.push(newComponent);
  }

  return newComponents;
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function calculateEAN13Checksum(codeWithoutChecksum: string) {
  const digits = codeWithoutChecksum.split('').map(Number);

  const sum = digits.reduce((acc, digit, index) => {
    const isEvenPosition = (index + 1) % 2 === 0;
    return acc + digit * (isEvenPosition ? 3 : 1);
  }, 0);
  const checksum = (10 - (sum % 10)) % 10;
  return checksum.toString();
}

function getBarCodeEAN13ForComponent(batch: string) {
  const baseCode = '200000000000';
  const batchNumber = Number.parseInt(batch.replaceAll(/\D/g, ''), 10);
  const codeWithoutChecksum = (
    BigInt(baseCode) + BigInt(batchNumber)
  ).toString();

  const checksum = calculateEAN13Checksum(codeWithoutChecksum);
  return codeWithoutChecksum + checksum;
}
