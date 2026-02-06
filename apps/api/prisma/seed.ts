import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import 'dotenv/config';
import { COMMON_COMPONENTS, COLOR_COMPONENTS } from './seed.data';
import { Batch } from '@repo/api';

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
  const qrCodesByComponentCode = new Map<string, string[]>();

  for (const item of allComponents) {
    const created = await prisma.component.create({
      data: {
        code: item.component.componentCode,
        name: item.component.componentName,
      },
      select: { id: true, code: true },
    });

    if (item.batches.length > 0) {
      await prisma.componentBatch.createMany({
        data: item.batches.map((batch) => {
          return {
            componentId: created.id,
            batchNumber: batch.batchNumber,
            expiresAt: batch.expiresAt,
          };
        }),
        skipDuplicates: true,
      });

      const batchNumbers = item.batches.map((batch) => batch.batchNumber);
      const existingBatches = await prisma.componentBatch.findMany({
        where: {
          componentId: created.id,
          batchNumber: { in: batchNumbers },
        },
        select: { id: true, batchNumber: true },
      });

      const qrEntries = await Promise.all(
        existingBatches.map(async (batch) => {
          const qrCodeData = {
            batchId: batch.id,
            batch: batch.batchNumber,
            componentId: created.id,
            componentName: item.component.componentName,
          };

          return {
            id: batch.id,
            batchNumber: batch.batchNumber,
            qrCodeData: JSON.stringify(qrCodeData),
          };
        }),
      );

      if (qrEntries.length > 0) {
        await prisma.$transaction(
          qrEntries.map((batch) =>
            prisma.componentBatch.update({
              where: { id: batch.id },
              data: { qrCodeData: batch.qrCodeData },
            }),
          ),
        );
      }
    }
  }

  for (let orderIndex = 0; orderIndex < ORDERS.length; orderIndex += 1) {
    const order = ORDERS[orderIndex];
    const components = COMMON_COMPONENTS.map((item) => ({
      componentCode: item.component.componentCode,
      componentName: item.component.componentName,
      requiredQty: item.component.requiredQty,
      unit: item.component.unit,
      validBatches:
        qrCodesByComponentCode.get(item.component.componentCode) ?? [],
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
        description: order.description,
        plannedAt: order.plannedAt,
        components: {
          create: components,
        },
      },
    });
  }
}

seed()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
