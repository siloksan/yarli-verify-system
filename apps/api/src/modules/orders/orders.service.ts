import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search?: string) {
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

    return this.prisma.productionOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        label: true,
        description: true,
        plannedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
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

    return order;
  }
}
