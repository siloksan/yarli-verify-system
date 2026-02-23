import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BucketResponseDto, CreateBucketDto } from './dto/create-bucket.dto';
import { UpdateBucketDto } from './dto/update-bucket.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BucketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBucketDto: CreateBucketDto) {
    const component = await this.prisma.component.findUnique({
      where: { name: createBucketDto.componentName }
    });
  
    if (!component) {
      throw new NotFoundException(`Компонент с таким именем: "${createBucketDto.componentName}" не найден`);
    }

    const bucket = await this.prisma.bucket.create({
      data: createBucketDto,
    });

    return plainToInstance(
      BucketResponseDto,
      bucket,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async findAll() {
    const buckets = await this.prisma.bucket.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return plainToInstance(
      BucketResponseDto,
      buckets,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async findOne(id: string) {
    const bucket = await this.prisma.bucket.findUnique({
      where: {
        id,
      },
    });

    if (!bucket) {
      throw new NotFoundException('Bucket not found');
    }

    return plainToInstance(
      BucketResponseDto,
      bucket,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async update(id: string, updateBucketDto: UpdateBucketDto) {
    const updateBucket = await this.prisma.bucket.update({
      where: {
        id,
      },
      data: updateBucketDto,
    });

    
    return plainToInstance(
      BucketResponseDto,
      updateBucket,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async remove(id: string) {
    const deletedBucket = await this.prisma.bucket.delete({
      where: {
        id,
      },
    });

    return plainToInstance(
      BucketResponseDto,
      deletedBucket,
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
