import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BucketsService } from './buckets.service';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { UpdateBucketDto } from './dto/update-bucket.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('buckets')
export class BucketsController {
  constructor(private readonly bucketsService: BucketsService) {}

  @Post()
  create(@Body() createBucketDto: CreateBucketDto) {
    return this.bucketsService.create(createBucketDto);
  }

  @Get()
  @ApiQuery({ name: 'q', required: false, type: String })
  findAll(@Query('q') q?: string) {
    return this.bucketsService.findAll(q);
  }
    
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bucketsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBucketDto: UpdateBucketDto) {
    return this.bucketsService.update(id, updateBucketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bucketsService.remove(id);
  }
}
