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
              code: {
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
            batchNumber: true,
          },
        },
      },
    });

    const mapped = result.map((component) => ({
      id: component.id,
      code: component.code,
      name: component.name,
      batches: component.batches.map((batch) => batch.batchNumber),
    }));

    return plainToInstance(ComponentDto, mapped, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const component = await this.prisma.component.findUnique({
      where: { id },
      include: {
        batches: {
          select: {
            batchNumber: true,
          },
        },
      },
    });

    if (!component) {
      throw new NotFoundException('Component not found');
    }

    return plainToInstance(
      ComponentDto,
      {
        id: component.id,
        code: component.code,
        name: component.name,
        batches: component.batches.map((batch) => batch.batchNumber),
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
