import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Импорт данных из вашего файла
import { recipes, componentsCatalog } from './orders-recipe';

// Типы для производственных заказов
type ProductionOrderSeed = {
  orderNumber: string;
  label: string;
  description?: string;
  plannedAt: Date;
  batchSize: number;
  recipeName: string;
};

// Конвертация рецептов в производственные заказы

// Функция для генерации EAN-13 штрихкода
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

// Получение даты истечения срока (6 месяцев от текущей даты)
function getExpiryDate(baseDate: Date = new Date()): Date {
  const expiryDate = new Date(baseDate);
  expiryDate.setMonth(expiryDate.getMonth() + 6);
  return expiryDate;
}

// Функция для сбора всех рецептов в плоский массив
// function getAllRecipes() {
//   return [
//     ...Object.values(recipes.polyester),
//     ...Object.values(recipes.acrylic),
//     ...Object.values(recipes.waterDispersion),
//   ];
// }

async function seed() {
  console.log('🌱 Начало seed...');

  // Очистка базы данных
  console.log('Очистка таблиц...');
  await prisma.scanEvent.deleteMany();
  await prisma.componentBatch.deleteMany();
  await prisma.recipeComponent.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.component.deleteMany();

  // 1. СОЗДАНИЕ КОМПОНЕНТОВ И ИХ ПАРТИЙ
  console.log('Создание компонентов и партий...');

  for (const component of componentsCatalog) {
    // Создаем компонент
    const created = await prisma.component.create({
      data: {
        name: component.name,
      },
      select: { id: true },
    });

    // Создаем партии для компонента (1-4 партии)
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

  // 2. ПОЛУЧАЕМ ВСЕ СОЗДАННЫЕ ПАРТИИ ДЛЯ ДАЛЬНЕЙШЕГО ИСПОЛЬЗОВАНИЯ
  const allComponentBatches = await prisma.componentBatch.findMany({
    include: {
      component: true,
    },
  });

  // Группируем партии по имени компонента
  const batchesByComponentName = new Map<string, typeof allComponentBatches>();
  allComponentBatches.forEach((batch) => {
    const componentName = batch.component.name;
    if (!batchesByComponentName.has(componentName)) {
      batchesByComponentName.set(componentName, []);
    }
    batchesByComponentName.get(componentName)!.push(batch);
  });

  // 3. СОЗДАНИЕ ПРОИЗВОДСТВЕННЫХ ЗАКАЗОВ
  console.log('\nСоздание производственных заказов...');

  for (const order of recipes) {
    // Создаем производственный заказ
    const createdOrder = await prisma.productionOrder.create({
      data: {
        orderNumber: order.batch,
        label: order.name,
        plannedAt: order.expiresAt,
        weight: new Prisma.Decimal(order.batchSize),
      },
    });

    // Создаем компоненты рецепта
    let position = 1;
    for (const componentReq of order.components) {
      // Получаем доступные партии для этого компонента
      // const availableBatches =
      //   batchesByComponentName.get(componentReq.name) || [];

      // Выбираем случайные партии (от 1 до всех доступных)
      // const numBatchesToUse = Math.min(
      //   Math.floor(Math.random() * availableBatches.length) + 1,
      //   availableBatches.length,
      // );

      // const selectedBatches = availableBatches
      //   .sort(() => 0.5 - Math.random())
      //   .slice(0, numBatchesToUse)
      //   .map((b) => b.batchNumber);

      // Создаем запись компонента в рецепте
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

  // 4. ВАЛИДАЦИЯ
  console.log('\n🔍 Проверка данных...');

  // Проверка уникальности партий компонентов
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

  // Проверка количества компонентов в рецептах
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

  // Статистика
  const componentCount = await prisma.component.count();
  const batchCount = await prisma.componentBatch.count();
  const orderCount = await prisma.productionOrder.count();
  const recipeComponentCount = await prisma.recipeComponent.count();

  console.log('\n📊 СТАТИСТИКА:');
  console.log(`  Компонентов: ${componentCount}`);
  console.log(`  Партий компонентов: ${batchCount}`);
  console.log(`  Производственных заказов: ${orderCount}`);
  console.log(`  Связей рецептов: ${recipeComponentCount}`);

  // Распределение по количеству партий на компонент
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

// Запуск seed
seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
