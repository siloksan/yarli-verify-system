import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateFillingBucketActDto,
  FillingBucketActResponseDto,
} from './dto/create-filling-bucket-act.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FillingBucketActsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFillingBucketActDto: CreateFillingBucketActDto) {
    const { componentName, componentBarcode, validBatchesId, ...createData } =
      createFillingBucketActDto;

    const batch = await this.prisma.componentBatch.findUnique({
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
    console.log('batch: ', batch);

    if (!batch) {
      throw new NotFoundException('Компонент не найден в системе');
    }
    // componentId in createFillingBucketActDto !== batch.component.id, createFillingBucketActDto orderDto data
    if (batch.component.name !== componentName) {
      throw new NotFoundException(
        `Сканирован ${batch.component.name}, ожидался ${componentName}`,
      );
    }

    if (validBatchesId.length > 0 && !validBatchesId.includes(batch.id)) {
      throw new NotFoundException(
        `Сканирована неразрешённая партия ${batch.batchNumber}`,
      );
    }
    const createdAct = await this.prisma.fillingActBucket.create({
      data: {
        ...createData,
        componentId: batch.component.id,
        batchId: batch.id,
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
