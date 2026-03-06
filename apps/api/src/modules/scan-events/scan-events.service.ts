import { BadRequestException, Injectable } from '@nestjs/common';
import { ScanResult } from '../../../generated/prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateBarcodeScanEventDto,
  CreateQrCodeScanEventDto,
  ScanEventDto,
} from './dto/create-scan-event.dto';
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ScanEventCreatedEvent } from './events/scan-event-created.event';
import { EVENTS } from 'src/common/constants/events.constant';

@Injectable()
export class ScanEventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createBarcodeScanEvent(createScanEventDto: CreateBarcodeScanEventDto) {
    const events: ScanEventCreatedEvent[] = [];

    const result = await this.prisma.$transaction(async (tx) => {
      const {
        scannedCode,
        orderId,
        deviceId,
        operatorId,
        validBatches,
        componentName,
        componentId,
      } = createScanEventDto;

      const scannedData = await tx.componentBatch.findFirst({
        where: { barcode: scannedCode },
        select: {
          id: true,
          batchNumber: true,
          component: {
            select: { name: true },
          },
        },
      });

      if (!scannedData) {
        throw new BadRequestException('Компонент не найден в системе');
      }

      let scanResult = scannedData.component.name === componentName;

      if (validBatches.length > 0) {
        scanResult = validBatches.includes(scannedData.batchNumber);
      }

      const scanEventData = await tx.scanEvent.create({
        data: {
          orderId,
          componentId,
          batchId: scannedData.id,
          scannedCode,
          result: scanResult ? ScanResult.OK : ScanResult.WRONG,
          deviceId,
          operatorId,
        },
      });

      if (scanEventData.result !== ScanResult.OK) {
        events.push(new ScanEventCreatedEvent(scanEventData.id));
      }

      return {
        scanEventData,
        scannedData,
      };
    });

    for (const event of events) {
      this.eventEmitter.emit(EVENTS.NOTIFICATIONS.SCAN_EVENT_CREATED, event);
    }

    return plainToInstance(
      ScanEventDto,
      {
        ...result.scanEventData,
        result: result.scanEventData.result,
        scannedComponentName: result.scannedData.component.name,
        scannedComponentBatch: result.scannedData.batchNumber,
      },
      { excludeExtraneousValues: true },
    );
  }

  async createQrCodeScanEvent(createScanEventDto: CreateQrCodeScanEventDto) {
    const events: ScanEventCreatedEvent[] = [];

    const {
      orderId,
      deviceId,
      operatorId,
      recipeComponentId,
      recipeComponentName,
      qrData,
    } = createScanEventDto;

    const { scannedData, scanEventData } = await this.prisma.$transaction(
      async (tx) => {
        const scannedData = await tx.component.findFirst({
          where: { id: qrData.componentId },
          select: {
            id: true,
            name: true,
          },
        });

        if (!scannedData) {
          throw new BadRequestException('Сканированный код не распознан');
        }

        const scanResult = scannedData.name === recipeComponentName;

        const scanEventData = await tx.scanEvent.create({
          data: {
            orderId,
            componentId: recipeComponentId,
            bucketId: qrData.id,
            result: scanResult ? ScanResult.OK : ScanResult.WRONG,
            deviceId,
            operatorId,
          },
        });

        if (scanEventData.result !== ScanResult.OK) {
          events.push(new ScanEventCreatedEvent(scanEventData.id));
        }

        return {
          scanEventData,
          scannedData,
        };
      },
    );

    for (const event of events) {
      this.eventEmitter.emit(EVENTS.NOTIFICATIONS.SCAN_EVENT_CREATED, event);
    }

    return plainToInstance(
      ScanEventDto,
      {
        ...scanEventData,
        scanResult: scanEventData.result,
        scannedComponentName: scannedData.name,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
