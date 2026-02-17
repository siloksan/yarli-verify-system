import { Controller, Get, Param } from '@nestjs/common';
import { BatchesService } from './batches.service';

@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get(':code')
  findBatchByCode(@Param('code') code: string) {
    return this.batchesService.findOneByCode(code);
  }
}
