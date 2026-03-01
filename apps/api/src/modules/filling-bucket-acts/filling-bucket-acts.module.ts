import { Module } from '@nestjs/common';
import { FillingBucketActsService } from './filling-bucket-acts.service';
import { FillingBucketActsController } from './filling-bucket-acts.controller';

@Module({
  controllers: [FillingBucketActsController],
  providers: [FillingBucketActsService],
})
export class FillingBucketActsModule {}
