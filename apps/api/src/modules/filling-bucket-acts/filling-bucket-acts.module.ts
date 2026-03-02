import { Module } from '@nestjs/common';
import { FillingBucketActsService } from './filling-bucket-acts.service';
import { FillingBucketActsController } from './filling-bucket-acts.controller';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';

@Module({
  imports: [TelegramBotModule],
  controllers: [FillingBucketActsController],
  providers: [FillingBucketActsService],
})
export class FillingBucketActsModule {}
