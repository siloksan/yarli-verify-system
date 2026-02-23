import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  CreateFillingBucketActDto,
  FillingBucketActResponseDto,
} from './dto/create-filling-bucket-act.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FillingBucketActsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFillingBucketActDto: CreateFillingBucketActDto) {
    console.log('createFillingBucketActDto: ', createFillingBucketActDto);
    // TODO check componentId,  bucketId, orderId, componentBatch exist
    //throw error if doesn't

    const createdAct = await this.prisma.fillingActBucket.create({
      data: createFillingBucketActDto,
    });

    return plainToInstance(FillingBucketActResponseDto, createdAct, {
      excludeExtraneousValues: true,
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
