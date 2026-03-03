import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { ConfigModule } from '../../common/config/config.module';
import { NOTIFICATION_SERVICE } from 'src/common/config/constant/services.token';

@Module({
  imports: [ConfigModule],
  providers: [
    TelegramBotService,
    {
      provide: NOTIFICATION_SERVICE,
      useExisting: TelegramBotService,
    },
  ],
  exports: [NOTIFICATION_SERVICE],
})
export class TelegramBotModule {}
