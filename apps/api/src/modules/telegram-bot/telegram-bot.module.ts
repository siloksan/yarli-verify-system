import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { ConfigModule } from '../../common/config/config.module';
import { NOTIFICATION_SERVICE } from 'src/common/config/constant/services.token';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: NOTIFICATION_SERVICE,
      useClass: TelegramBotService,
    },
  ],
  exports: [TelegramBotService],
})
export class TelegramBotModule {}
