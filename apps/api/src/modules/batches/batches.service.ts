import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BatchDto } from './dto/batch.dto';

@Injectable()
export class BatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByCode(code: string) {
    const batch = await this.prisma.componentBatch.findUnique({
      where: { barcode: code },
      select: {
        id: true,
        batchNumber: true,
        componentId: true,
        barcode: true,
        component: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    return plainToInstance(
      BatchDto,
      {
        id: batch.id,
        batch: batch.batchNumber,
        componentId: batch.componentId,
        componentName: batch.component.name,
        code: batch.barcode,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
