import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import 'dotenv/config';
import { recipes, componentsCatalog } from './seed.data';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function calculateEAN13Checksum(codeWithoutChecksum: string): string {
  const digits = codeWithoutChecksum.split('').map(Number);
  const sum = digits.reduce((acc, digit, index) => {
    const isEvenPosition = (index + 1) % 2 === 0;
    return acc + digit * (isEvenPosition ? 3 : 1);
  }, 0);
  const checksum = (10 - (sum % 10)) % 10;
  return checksum.toString();
}

function getBarCodeEAN13ForComponent(batchNumber: string): string {
  const baseCode = '200000000000';
  const batchNum = parseInt(batchNumber.replace(/\D/g, ''), 10);
  const codeWithoutChecksum = (BigInt(baseCode) + BigInt(batchNum)).toString();
  const checksum = calculateEAN13Checksum(codeWithoutChecksum);
  return codeWithoutChecksum + checksum;
}

function getExpiryDate(baseDate: Date = new Date()): Date {
  const expiryDate = new Date(baseDate);
  expiryDate.setMonth(expiryDate.getMonth() + 6);
  return expiryDate;
}

async function seed() {
  console.log('🌱 Начало seed...');

  console.log('Очистка таблиц...');
  await prisma.scanEvent.deleteMany();
  await prisma.componentBatch.deleteMany();
  await prisma.recipeComponent.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.component.deleteMany();

  console.log('Создание компонентов и партий...');

  for (const component of componentsCatalog) {
    const created = await prisma.component.create({
      data: {
        name: component.name,
      },
      select: { id: true },
    });

    if (component.batches.length > 0) {
      await prisma.componentBatch.createMany({
        data: component.batches.map((batchNumber) => ({
          componentId: created.id,
          batchNumber: batchNumber,
          barcode: getBarCodeEAN13ForComponent(batchNumber),
          expiresAt: getExpiryDate(),
        })),
        skipDuplicates: true,
      });

      console.log(`  ✓ ${component.name}: ${component.batches.length} партий`);
    }
  }

  const allComponentBatches = await prisma.componentBatch.findMany({
    include: {
      component: true,
    },
  });

  const batchesByComponentName = new Map<string, typeof allComponentBatches>();
  allComponentBatches.forEach((batch) => {
    const componentName = batch.component.name;
    if (!batchesByComponentName.has(componentName)) {
      batchesByComponentName.set(componentName, []);
    }
    batchesByComponentName.get(componentName)!.push(batch);
  });
  console.log('\nСоздание производственных заказов...');

  for (const order of recipes) {
    const createdOrder = await prisma.productionOrder.create({
      data: {
        orderNumber: order.batch,
        label: order.name,
        plannedAt: order.expiresAt,
        weight: new Prisma.Decimal(order.batchSize),
      },
    });

    let position = 1;
    for (const componentReq of order.components) {
      await prisma.recipeComponent.create({
        data: {
          orderId: createdOrder.id,
          componentName: componentReq.name,
          position: position++,
          requiredQty: new Prisma.Decimal(componentReq.weight),
          unit: 'кг',
          validBatches: [],
        },
      });
    }

    console.log(`  ✓ ${order.batch}: ${order.name} (${order.batchSize} кг)`);
  }

  console.log('\n🔍 Проверка данных...');

  const allBatches = await prisma.componentBatch.findMany({
    select: { batchNumber: true },
  });

  const batchNumbers = allBatches.map((b) => b.batchNumber);
  const uniqueBatches = new Set(batchNumbers);

  if (batchNumbers.length !== uniqueBatches.size) {
    console.warn('⚠ Обнаружены дубликаты партий компонентов!');
  } else {
    console.log('✓ Все партии компонентов уникальны');
  }

  const recipesWithComponents = await prisma.productionOrder.findMany({
    include: {
      components: true,
    },
  });

  for (const recipe of recipesWithComponents) {
    console.log(
      `  ${recipe.orderNumber}: ${recipe.components.length} компонентов`,
    );
  }

  const componentCount = await prisma.component.count();
  const batchCount = await prisma.componentBatch.count();
  const orderCount = await prisma.productionOrder.count();
  const recipeComponentCount = await prisma.recipeComponent.count();

  console.log('\n📊 СТАТИСТИКА:');
  console.log(`  Компонентов: ${componentCount}`);
  console.log(`  Партий компонентов: ${batchCount}`);
  console.log(`  Производственных заказов: ${orderCount}`);
  console.log(`  Связей рецептов: ${recipeComponentCount}`);

  const componentsWithBatches = await prisma.component.findMany({
    include: {
      batches: true,
    },
  });

  const distribution = {
    1: componentsWithBatches.filter((c) => c.batches.length === 1).length,
    2: componentsWithBatches.filter((c) => c.batches.length === 2).length,
    3: componentsWithBatches.filter((c) => c.batches.length === 3).length,
    4: componentsWithBatches.filter((c) => c.batches.length === 4).length,
  };

  console.log('\n📈 Распределение партий:');
  console.log(`  С 1 партией: ${distribution[1]} компонентов`);
  console.log(`  С 2 партиями: ${distribution[2]} компонентов`);
  console.log(`  С 3 партиями: ${distribution[3]} компонентов`);
  console.log(`  С 4 партиями: ${distribution[4]} компонентов`);

  console.log('\n✅ Seed завершен успешно!');
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
