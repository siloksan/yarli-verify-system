import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateFillingBucketActDto,
  FillingBucketActResponseDto,
} from './dto/create-filling-bucket-act.dto';
import { plainToInstance } from 'class-transformer';
import { ScanResult } from '@repo/api';

@Injectable()
export class FillingBucketActsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFillingBucketActDto: CreateFillingBucketActDto) {
    const {
      orderId,
      recipeComponentId,
      recipeComponentName,
      componentBarcode,
      validBatchesId,
      workerName,
      ...createData
    } = createFillingBucketActDto;

    const scannedBatch = await this.prisma.componentBatch.findUnique({
      where: {
        barcode: componentBarcode,
      },
      select: {
        id: true,
        batchNumber: true,
        component: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    console.log('createFillingBucketActDto: ', createFillingBucketActDto);
    console.log('scannedBatch: ', scannedBatch);

    if (!scannedBatch) {
      throw new NotFoundException('Компонент не найден в системе');
    }

    const scanResult = scannedBatch.component.name === recipeComponentName;
    if (!scanResult) {
      throw new NotFoundException(
        `Сканирован ${scannedBatch.component.name}, ожидался ${recipeComponentName}`,
      );
    }

    if (
      validBatchesId.length > 0 &&
      !validBatchesId.includes(scannedBatch.id)
    ) {
      await this.prisma.scanEvent.create({
        data: {
          orderId,
          componentId: recipeComponentId,
          batchId: scannedBatch.id,
          scannedCode: componentBarcode,
          result: ScanResult.WRONG,
          deviceId: 'tutel_phone',
          operatorId: workerName,
        },
      });

      throw new NotFoundException(
        `Сканирована неразрешённая партия ${scannedBatch.batchNumber}`,
      );
    }

    try {
      const createdAct = await this.prisma.$transaction(async (tx) => {
        const act = await tx.fillingActBucket.create({
          data: {
            ...createData,
            workerName,
            orderId,
            componentId: scannedBatch.component.id,
            batchId: scannedBatch.id,
          },
          select: {
            id: true,
            workerName: true,
            weight: true,
            createdAt: true,
            bucketId: true,
            componentId: true,
            orderId: true,
            component: {
              select: {
                name: true,
              },
            },
            batch: {
              select: {
                batchNumber: true,
              },
            },
          },
        });

        await tx.scanEvent.create({
          data: {
            orderId,
            componentId: recipeComponentId,
            batchId: scannedBatch.id,
            scannedCode: componentBarcode,
            result: ScanResult.OK,
            deviceId: 'tutel_phone',
            operatorId: workerName,
          },
        });

        return act;
      });

      return plainToInstance(
        FillingBucketActResponseDto,
        {
          ...createdAct,
          componentName: createdAct.component.name,
          componentBatch: createdAct.batch.batchNumber,
        },
        {
          excludeExtraneousValues: true,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException('Не удалось создать акт фасовки');
    }
  }

  async findAll() {
    const fillingBucketActs = await this.prisma.fillingActBucket.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return fillingBucketActs.map((act) =>
      plainToInstance(FillingBucketActResponseDto, act, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findByBucketId(bucketId: string) {
    const fillingBucketActs = await this.prisma.fillingActBucket.findMany({
      where: {
        bucketId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (fillingBucketActs.length === 0) {
      throw new NotFoundException('Filling bucket act not found');
    }

    return plainToInstance(FillingBucketActResponseDto, fillingBucketActs, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const fillingBucketAct = await this.prisma.fillingActBucket.findUnique({
      where: {
        id,
      },
    });

    if (!fillingBucketAct) {
      throw new NotFoundException('Filling bucket act not found');
    }

    return plainToInstance(FillingBucketActResponseDto, fillingBucketAct, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedFillingAct = await this.prisma.fillingActBucket.delete({
      where: {
        id,
      },
    });

    return plainToInstance(FillingBucketActResponseDto, deletedFillingAct, {
      excludeExtraneousValues: true,
    });
  }
}

