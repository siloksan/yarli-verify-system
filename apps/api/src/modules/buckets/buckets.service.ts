import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BucketResponseDto, CreateBucketDto } from './dto/create-bucket.dto';
import { UpdateBucketDto } from './dto/update-bucket.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '../../../generated/prisma/client';

@Injectable()
export class BucketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBucketDto: CreateBucketDto) {
    const component = await this.prisma.component.findUnique({
      where: { id: createBucketDto.componentId },
    });

    if (!component) {
      throw new NotFoundException(`Компонент не найден в системе`);
    }

    const bucket = await this.prisma.bucket.create({
      data: createBucketDto,
      include: {
        component: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return plainToInstance(BucketResponseDto, bucket, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(search?: string) {
    const where: Prisma.BucketWhereInput | undefined = search
      ? {
          OR: [
            {
              component: {
                is: {
                  name: {
                    contains: search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            },
          ],
        }
      : undefined;

    const buckets = await this.prisma.bucket.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        component: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return plainToInstance(BucketResponseDto, buckets, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const bucket = await this.prisma.bucket.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        createdAt: true,
        creator: true,
        location: true,
        updatedAt: true,
        component: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!bucket) {
      throw new NotFoundException('Bucket not found');
    }

    return plainToInstance(BucketResponseDto, bucket, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateBucketDto: UpdateBucketDto) {
    const updateBucket = await this.prisma.bucket.update({
      where: {
        id,
      },
      data: updateBucketDto,
    });

    return plainToInstance(BucketResponseDto, updateBucket, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string) {
    const deletedBucket = await this.prisma.bucket.delete({
      where: {
        id,
      },
    });

    return plainToInstance(BucketResponseDto, deletedBucket, {
      excludeExtraneousValues: true,
    });
  }
}
