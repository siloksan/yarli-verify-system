import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FillingBucketActsService } from './filling-bucket-acts.service';
import { CreateFillingBucketActDto } from './dto/create-filling-bucket-act.dto';
import { API_ROUTES } from '@repo/api';

@Controller(API_ROUTES.filling_act_buckets)
export class FillingBucketActsController {
  constructor(
    private readonly fillingBucketActsService: FillingBucketActsService,
  ) {}

  @Post()
  create(@Body() createFillingBucketActDto: CreateFillingBucketActDto) {
    return this.fillingBucketActsService.create(createFillingBucketActDto);
  }

  @Get()
  findAll() {
    return this.fillingBucketActsService.findAll();
  }

  @Get('bucket/:bucketId')
  findByBucketId(@Param('bucketId') bucketId: string) {
    return this.fillingBucketActsService.findByBucketId(bucketId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fillingBucketActsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fillingBucketActsService.remove(id);
  }
}
