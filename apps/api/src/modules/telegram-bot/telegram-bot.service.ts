import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConfigService } from '../../common/config/config.service';
import { NotificationService } from 'src/common/notification/notification.interface';
import { ScanEventWithOrderNotification } from 'src/common/notification/dto/scan-event-notification.dto';

export interface IScanEventBotMessage {
  requireComponentName: string;
  orderName: string;
  orderBatch: string;
  scannedComponentName: string;
  operatorName: string;
  scannedComponentBatch?: string;
}

@Injectable()
export class TelegramBotService implements OnModuleInit, NotificationService {
  private readonly logger = new Logger(TelegramBotService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const telegramConfig = this.configService.getTelegramConfig();
    if (!telegramConfig.enabled) {
      this.logger.warn('Уведомления Telegram отключены');
      return;
    }

    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      this.logger.warn(
        'Уведомления Telegram включены, но отсутствует токен бота или chat id',
      );
      return;
    }

    this.logger.log('Уведомления Telegram включены');
  }

  private escapeTelegramMarkdownV2(payload: ScanEventWithOrderNotification) {
    for (const key of Object.keys(payload)) {
      if (typeof payload[key] === 'string') {
        payload[key] = payload[key].replaceAll(
          /([_*\[\]()~`>#+\-=|{}.!\\])/g,
          '\\$1',
        );
      } else {
        payload[key] = '-----';
      }
    }

    return payload;
  }

  private formatNetworkError(error: unknown) {
    if (!(error instanceof Error)) {
      return 'Неизвестная ошибка Telegram';
    }

    const cause = (error as Error & { cause?: unknown }).cause;
    if (!cause) {
      return error.message;
    }

    if (cause instanceof Error) {
      return `${error.message}; причина=${cause.name}: ${cause.message}`;
    }

    return `${error.message}; причина=${JSON.stringify(cause)}`;
  }

  async sendWrongScanEvent(
    payload: ScanEventWithOrderNotification,
  ): Promise<void> {
    const telegramConfig = this.configService.getTelegramConfig();

    if (!telegramConfig.enabled) {
      return;
    }

    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      this.logger.error(
        'Уведомления Telegram включены, но отсутствует TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID',
      );

      return;
    }

    const message = this.buildWrongScanMessage(payload);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: telegramConfig.chatId,
            text: message,
            parse_mode: 'MarkdownV2',
            disable_web_page_preview: true,
          }),
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        const payload = await response.text();
        this.logger.error(
          `Ошибка запроса к Telegram API: ${response.status} ${response.statusText}. Ответ: ${payload}`,
        );
      }
    } catch (error) {
      const errorMessage = this.formatNetworkError(error);
      this.logger.error(
        `Не удалось отправить уведомление в Telegram из-за сетевой ошибки или ошибки API: ${errorMessage}`,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildWrongScanMessage(payload: ScanEventWithOrderNotification) {
    const {
      createdAt,
      orderBatch,
      orderName,
      recipeComponentName,
      scannedComponentBatch,
      scannedComponentName,
      workerName,
    } = this.escapeTelegramMarkdownV2(payload);

    const lines = [
      '🚨 *ОШИБКА СКАНИРОВАНИЯ* 🚨',
      '━━━━━━━━━━━━━━━━━━',
      '',
      '⚠️ *Критическое несоответствие*',
      '',
      `🟢 *Ожидался:* \`${recipeComponentName}\``,
      `🔴 *Отсканирован:* \`${scannedComponentName}\``,
      `📌 Партия сканированного компонента: *${scannedComponentBatch}*`
      '',
      '━━━━━━━━━━━━━━━━━━',
      '📦 *Контекст операции*',
      '',
      `🧾 Заказ: *${orderName}*`,
      `🏷 Партия заказа: *${orderBatch}*`,
      `👷 Оператор: *${workerName}*`,
      `⏱ Время сканирования: *${createdAt}*`,
    ];

    lines.push('');
    lines.push('❗ *Требуется проверка перед продолжением работы*');

    return lines.join('\n');
  }
}
