import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateFillingBucketActDto,
  CreateFillingContainerAct,
  FillingBucketActResponseDto,
  FillingContainerActResponseDto,
} from './dto/create-filling-bucket-act.dto';
import { plainToInstance } from 'class-transformer';
import { ScanResult } from '@repo/api';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ScanEventCreatedEvent } from '../scan-events/events/scan-event-created.event';
import { EVENTS } from 'src/common/constants/events.constant';

@Injectable()
export class FillingBucketActsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createFillingBucketActDto: CreateFillingBucketActDto) {
    // const events: ScanEventCreatedEvent[] = [];

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
      FillingBucketActResponseDto,
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
  ) {
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
      FillingContainerActResponseDto,
      {
        id: fillAct.id,
        workerName: fillAct.workerName,
        weight: fillAct.weight,
        componentName: fillAct.component.name,
        componentBatchNumber: fillAct.batch.batchNumber,
        createAt: fillAct.createdAt,
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
        FillingBucketActResponseDto,
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
