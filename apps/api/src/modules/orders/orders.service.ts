import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderResponseDto } from './dto/order.dto';
import { plainToInstance } from 'class-transformer';
import { OrderWithComponentsResponseDto } from './dto/order-component.dto';
import { OrderStatus } from '@repo/api';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async searchAllByStatus(statuses: OrderStatus[], search: string) {
    const where: Prisma.ProductionOrderWhereInput = {
      status: { in: statuses },
      AND: [
        {
          orderNumber: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          label: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };

    const result = await this.prisma.productionOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        label: true,
        updatedAt: true,
        status: true,
      },
    });

    return plainToInstance(OrderResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async findAllByStatus(statuses: OrderStatus[]) {
    const where: Prisma.ProductionOrderWhereInput = {
      status: { in: statuses },
    };

    const result = await this.prisma.productionOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        label: true,
        updatedAt: true,
      },
    });

    return plainToInstance(OrderResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async findRecipe(orderId: string) {
    const order = await this.prisma.productionOrder.findUnique({
      where: { id: orderId },
      include: {
        components: {
          orderBy: { componentName: 'asc' },
          include: {
            scanEvents: {
              orderBy: { scannedAt: 'desc' },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return plainToInstance(OrderWithComponentsResponseDto, order, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
