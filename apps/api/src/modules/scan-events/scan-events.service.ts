import { BadRequestException, Injectable } from '@nestjs/common';
import { ScanResult } from '../../../generated/prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateBarcodeScanEventDto,
  CreateQrcodeScanEventDto,
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
      throw new BadRequestException('Scanned code is not recognized');
    }

    let scanResult = scannedData.component.name === componentName;

    if (scanResult && validBatches.length > 0) {
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

  async createQrcodeScanEvent(createScanEventDto: CreateQrcodeScanEventDto) {
    const {
      orderId,
      deviceId,
      operatorId,
      validBatches,
      componentName,
      componentId,
      qrData,
    } = createScanEventDto;
    const scannedData = await this.prisma.component.findFirst({
      where: { id: qrData.componentId },
      select: {
        id: true,
        componentName: true,
      },
    });

    if (!scannedData) {
      throw new BadRequestException('Сканированный код не распознан');
    }

    let scanResult = scannedData.component.name === componentName;

    const scanEventData = await this.prisma.scanEvent.create({
      data: {
        orderId,
        componentId,
        bucketId,
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
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
