import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FillingBucketActsService } from './filling-bucket-acts.service';
import {
  CreateFillingBucketActDto,
  CreateFillingContainerAct,
} from './dto/create-filling-bucket-act.dto';
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

  @Post('bucket/:bucketId')
  createFillContainerAct(
    @Param('bucketId') bucketId: string,
    @Body() createFillingContainerAct: CreateFillingContainerAct,
  ) {
    return this.fillingBucketActsService.createFillContainerAct(
      bucketId,
      createFillingContainerAct,
    );
  }
}
