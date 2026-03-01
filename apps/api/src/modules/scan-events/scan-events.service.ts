import { BadRequestException, Injectable } from '@nestjs/common';
import { ScanResult } from '../../../generated/prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateBarcodeScanEventDto,
  CreateQrCodeScanEventDto,
  ScanEventDto,
} from './dto/create-scan-event.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ScanEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBarcodeScanEvent(createScanEventDto: CreateBarcodeScanEventDto) {
    const {
      scannedCode,
      orderId,
      deviceId,
      operatorId,
      validBatches,
      componentName,
      componentId,
    } = createScanEventDto;

    const scannedData = await this.prisma.componentBatch.findFirst({
      where: { barcode: scannedCode },
      select: {
        id: true,
        batchNumber: true,
        component: {
          select: {
            name: true,
          },
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

    const scanEventData = await this.prisma.scanEvent.create({
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

    return plainToInstance(
      ScanEventDto,
      {
        ...scanEventData,
        scanResult: scanEventData.result,
        scannedComponentName: scannedData.component.name,
        scannedComponentBatch: scannedData.batchNumber,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async createQrCodeScanEvent(createScanEventDto: CreateQrCodeScanEventDto) {
    const {
      orderId,
      deviceId,
      operatorId,
      recipeComponentId,
      recipeComponentName,
      qrData,
    } = createScanEventDto;
    const scannedData = await this.prisma.component.findFirst({
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

    const scanEventData = await this.prisma.scanEvent.create({
      data: {
        orderId,
        componentId: recipeComponentId,
        bucketId: qrData.id,
        result: scanResult ? ScanResult.OK : ScanResult.WRONG,
        deviceId,
        operatorId,
      },
    });

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
