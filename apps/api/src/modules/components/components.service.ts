import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ComponentDto } from './dto/component.dto';

@Injectable()
export class ComponentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const where: Prisma.ComponentWhereInput | undefined = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              batches: {
                some: {
                  batchNumber: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            },
          ],
        }
      : undefined;

    const result = await this.prisma.component.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        batches: {
          select: {
            id: true,
            batchNumber: true,
            barcode: true,
          },
        },
      },
    });

    return plainToInstance(ComponentDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async findOneById(id: string) {
    const component = await this.prisma.component.findUnique({
      where: { id },
      include: {
        batches: {
          select: {
            id: true,
            batchNumber: true,
            barcode: true,
          },
        },
      },
    });

    if (!component) {
      throw new NotFoundException('Component not found');
    }

    return plainToInstance(ComponentDto, component, {
      excludeExtraneousValues: true,
    });
  }
}
