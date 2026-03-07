import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateFillingBucketActDto,
  CreateFillingContainerAct,
  FillingContainerActResponseDto,
} from './dto/create-filling-bucket-act.dto';
import { plainToInstance } from 'class-transformer';
import { IFillingContainerActResponseDto, ScanResult } from '@repo/api';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ScanEventCreatedEvent } from '../scan-events/events/scan-event-created.event';
import { EVENTS } from 'src/common/constants/events.constant';

@Injectable()
export class FillingBucketActsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createFillingBucketActDto: CreateFillingBucketActDto,
  ): Promise<IFillingContainerActResponseDto> {
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

    if (!scannedBatch) {
      throw new NotFoundException('Компонент не найден в системе!');
    }

    const scanResult = scannedBatch.component.name === recipeComponentName;

    if (!scanResult) {
      const scanEventData = await this.prisma.scanEvent.create({
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

      this.eventEmitter.emit(
        EVENTS.NOTIFICATIONS.SCAN_EVENT_CREATED,
        new ScanEventCreatedEvent(scanEventData.id),
      );

      throw new NotFoundException(
        `Сканированный компонент: ${scannedBatch.component.name}, не соответствует рецептурному: ${recipeComponentName}`,
      );
    }

    if (
      validBatchesId.length > 0 &&
      !validBatchesId.includes(scannedBatch.id)
    ) {
      const scanEventData = await this.prisma.scanEvent.create({
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

      this.eventEmitter.emit(
        EVENTS.NOTIFICATIONS.SCAN_EVENT_CREATED,
        new ScanEventCreatedEvent(scanEventData.id),
      );

      throw new NotFoundException(
        `Сканирован компонент ${recipeComponentName} не верной партии: ${scannedBatch.batchNumber}`,
      );
    }

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

      const scanEvent = await tx.scanEvent.create({
        data: {
          orderId,
          componentId: recipeComponentId,
          scannedCode: componentBarcode,
          result: ScanResult.OK,
          deviceId: 'tutel_phone',
          operatorId: workerName,
        },
      });

      return { act, scanEvent };
    });

    return plainToInstance(
      FillingContainerActResponseDto,
      {
        ...createdAct,
        componentName: createdAct.act.component.name,
        componentBatch: createdAct.act.batch.batchNumber,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async createFillContainerAct(
    bucketId: string,
    createFillingContainerAct: CreateFillingContainerAct,
  ): Promise<IFillingContainerActResponseDto> {
    const { componentBarcode, ...createData } = createFillingContainerAct;

    const scannedBatch = await this.prisma.componentBatch.findUnique({
      where: {
        barcode: componentBarcode,
      },
      select: {
        id: true,
        component: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    console.log('scannedBatch: ', scannedBatch);

    if (!scannedBatch) {
      throw new NotFoundException('Компонент не найден в системе');
    }

    const bucketData = await this.prisma.bucket.findUnique({
      where: {
        id: bucketId,
      },
      select: {
        component: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (scannedBatch.component.id !== bucketData.component.id) {
      throw new NotFoundException(
        `Обнаружено не соответствие: ёмкость из под ${bucketData.component.name} не подходит для заполнения ${scannedBatch.component.name}`,
      );
    }

    const fillAct = await this.prisma.fillingActBucket.create({
      data: {
        bucketId,
        batchId: scannedBatch.id,
        componentId: bucketData.component.id,
        validBatchesId: [],
        ...createData,
      },
      select: {
        id: true,
        workerName: true,
        weight: true,
        createdAt: true,
        component: {
          select: {
            name: true,
            id: true,
          },
        },
        batch: {
          select: {
            batchNumber: true,
          },
        },
        bucket: {
          select: {
            id: true,
          },
        },
        order: {
          select: {
            id: true,
          },
        },
      },
    });

    return plainToInstance(
      FillingContainerActResponseDto,
      {
        id: fillAct.id,
        componentId: fillAct.component.id,
        workerName: fillAct.workerName,
        weight: fillAct.weight,
        componentName: fillAct.component.name,
        componentBatch: fillAct.batch.batchNumber,
        createAt: fillAct.createdAt,
        bucketId: fillAct.bucket.id,
        orderId: fillAct?.order?.id ?? null,
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
      include: {
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

    return fillingBucketActs.map((act) =>
      plainToInstance(
        FillingContainerActResponseDto,
        {
          id: act.id,
          componentId: act.componentId,
          componentName: act.component.name,
          componentBatch: act.batch.batchNumber,
          workerName: act.workerName,
          weight: act.weight,
          createdAt: act.createdAt,
          bucketId: act.bucketId,
          orderId: act.orderId,
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
  }
}
