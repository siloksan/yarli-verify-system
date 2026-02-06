import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import 'dotenv/config';

import { COMMON_COMPONENTS } from './seed.data';

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
  await prisma.productionOrder.deleteMany();

  for (let orderIndex = 0; orderIndex < ORDERS.length; orderIndex += 1) {
    const order = ORDERS[orderIndex];
    const orderSuffix = `O${orderIndex + 1}`;

    const components = COMMON_COMPONENTS.map((item) => ({
      componentCode: item.component.componentCode,
      componentName: item.component.componentName,
      requiredQty: item.component.requiredQty,
      unit: item.component.unit,
      batches: {
        create: item.batches.map((batch) => ({
          qrCode: `${batch.qrCode}-${orderSuffix}`,
          batchNumber: batch.batchNumber
            ? `${batch.batchNumber}-${orderSuffix}`
            : undefined,
          lotNumber: batch.lotNumber
            ? `${batch.lotNumber}-${orderSuffix}`
            : undefined,
          expiresAt: batch.expiresAt,
        })),
      },
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
