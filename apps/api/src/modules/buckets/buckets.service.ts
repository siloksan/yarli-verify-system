import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { UpdateBucketDto } from './dto/update-bucket.dto';

@Injectable()
export class BucketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBucketDto: CreateBucketDto) {
    return this.prisma.bucket.create({
      data: createBucketDto,
    });
  }

  async findAll() {
    return this.prisma.bucket.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
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

    return bucket;
  }

  async update(id: string, updateBucketDto: UpdateBucketDto) {
    await this.findOne(id);

    return this.prisma.bucket.update({
      where: {
        id,
      },
      data: updateBucketDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.bucket.delete({
      where: {
        id,
      },
    });
  }
}
