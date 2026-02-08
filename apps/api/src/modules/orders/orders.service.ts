import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrderResponseDto } from './dto/order.dto';
import { plainToInstance } from 'class-transformer';
import { OrderWithComponentsResponseDto } from './dto/order-component.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const where: Prisma.ProductionOrderWhereInput | undefined = search
      ? {
          OR: [
            {
              label: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              orderNumber: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : undefined;

    const result =  await this.prisma.productionOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        label: true,
        updatedAt: true
      },
    });

    return plainToInstance(OrderResponseDto, result, { excludeExtraneousValues: true })
  }

  async findRecipe(orderId: string) {
    const order = await this.prisma.productionOrder.findUnique({
      where: { id: orderId },
      include: {
        components: {
          orderBy: { componentName: 'asc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    console.log(order)
    return plainToInstance(OrderWithComponentsResponseDto, order, { excludeExtraneousValues: true, enableImplicitConversion: true });
  }
}
