import { Module } from '@nestjs/common';
import { ScanEventsService } from './scan-events.service';
import { ScanEventsController } from './scan-events.controller';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module';
import { ScanEventsListener } from './events/scan-events.listener';

@Module({
  imports: [TelegramBotModule],
  controllers: [ScanEventsController],
  providers: [ScanEventsService, ScanEventsListener],
})
export class ScanEventsModule {}
