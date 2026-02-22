import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateFillingBucketActDto } from './dto/create-filling-bucket-act.dto';

@Injectable()
export class FillingBucketActsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFillingBucketActDto: CreateFillingBucketActDto) {
    return this.prisma.fillingActBucket.create({
      data: createFillingBucketActDto,
    });
  }

  async findAll() {
    return this.prisma.fillingActBucket.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const fillingBucketAct = await this.prisma.fillingActBucket.findUnique({
      where: {
        id,
      },
    });

    if (!fillingBucketAct) {
      throw new NotFoundException('Filling bucket act not found');
    }

    return fillingBucketAct;
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.fillingActBucket.delete({
      where: {
        id,
      },
    });
  }
}
