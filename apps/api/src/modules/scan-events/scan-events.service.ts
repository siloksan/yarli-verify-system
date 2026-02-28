import { BadRequestException, Injectable } from '@nestjs/common';
import { ScanResult } from '../../../generated/prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateScanEventDto, ScanEventDto } from './dto/create-scan-event.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ScanEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createScanEventBarcode(createScanEventDto: CreateScanEventDto) {
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
}
