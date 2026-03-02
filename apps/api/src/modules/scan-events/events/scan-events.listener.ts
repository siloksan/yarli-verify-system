import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ScanEventCreatedEvent } from './scan-event-created.event';
import { OnEvent } from '@nestjs/event-emitter';

import { NotificationService } from 'src/common/notification/notification.interface';
import { ScanEventWithOrderNotification } from 'src/common/notification/dto/scan-event-notification.dto';

@Injectable()
export class ScanEventsListener {
  private readonly logger = new Logger(ScanEventsListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('scan-event.created')
  async handleScanEventCreated(event: ScanEventCreatedEvent) {
    const scanEvent = await this.prisma.scanEvent.findUnique({
      where: { id: event.scanEventId },
      include: {
        component: true,
        order: true,
        batch: {
          select: {
            batchNumber: true,
            component: true,
          },
        },
        bucket: {
          select: {
            component: true,
          },
        },
      },
    });

    if (!scanEvent) {
      this.logger.error(
        `Событие сканирования ${event.scanEventId} не найдено для отправки уведомления`,
      );

      return;
    }

    const payload: ScanEventWithOrderNotification = {
      scanEventId: scanEvent.id,
      orderBatch: scanEvent.order.orderNumber,
      orderName: scanEvent.order.label,
      recipeComponentName: scanEvent.component.componentName,
      deviceName: scanEvent.deviceId,
      scannedComponentName:
        scanEvent.batch?.component.name ?? scanEvent.bucket.component.name,
      scannedComponentBatch: scanEvent.batch.batchNumber ?? null,
      createdAt: scanEvent.scannedAt,
      workerName: scanEvent.operatorId,
    };

    await this.notificationService.sendWrongScanEvent(payload);
  }
}
