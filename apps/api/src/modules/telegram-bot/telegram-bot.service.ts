import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConfigService } from '../../common/config/config.service';

export interface IScanEventBotMessage {
  requireComponentName: string;
  orderName: string;
  orderBatch: string;
  scannedComponentName: string;
  operatorName: string;
  scannedComponentBatch?: string;
}

@Injectable()
export class TelegramBotService implements OnModuleInit {
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

  async notifyWrongScan(event: IScanEventBotMessage) {
    if (event.scannedComponentName === event.requireComponentName) {
      return;
    }

    const telegramConfig = this.configService.getTelegramConfig();
    if (!telegramConfig.enabled) {
      return;
    }

    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      this.logger.warn(
        'Уведомления Telegram включены, но отсутствует TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID',
      );
      return;
    }

    const message = this.buildWrongScanMessage(event);

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

  async handleScanEventCreated(scanEventId: string) {
    try {
      const scanEvent = await this.prisma.scanEvent.findUnique({
        where: { id: scanEventId },
        select: {
          operatorId: true,
          order: {
            select: {
              orderNumber: true,
              label: true,
            },
          },
          component: {
            select: {
              componentName: true,
            },
          },
          batch: {
            select: {
              batchNumber: true,
              component: {
                select: {
                  name: true,
                },
              },
            },
          },
          bucket: {
            select: {
              component: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!scanEvent) {
        this.logger.warn(
          `Событие сканирования ${scanEventId} не найдено для отправки уведомления`,
        );
        return;
      }

      const scannedComponentName =
        scanEvent.batch?.component.name ?? scanEvent.bucket?.component.name;

      if (!scannedComponentName) {
        this.logger.warn(
          `Событие сканирования ${scanEventId} пропущено: не удалось определить название отсканированного компонента`,
        );
        return;
      }

      await this.notifyWrongScan({
        requireComponentName: scanEvent.component.componentName,
        orderName: scanEvent.order.orderNumber,
        orderBatch: scanEvent.order.label,
        scannedComponentName,
        operatorName: scanEvent.operatorId || 'Неизвестный оператор',
        scannedComponentBatch: scanEvent.batch?.batchNumber || undefined,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка слушателя';
      this.logger.error(
        `Не удалось обработать событие сканирования ${scanEventId} для Telegram-уведомления: ${errorMessage}`,
      );
    }
  }

  private buildWrongScanMessage(event: IScanEventBotMessage) {
    const required = this.escapeTelegramMarkdownV2(event.requireComponentName);
    const scanned = this.escapeTelegramMarkdownV2(event.scannedComponentName);
    const orderName = this.escapeTelegramMarkdownV2(event.orderName);
    const orderBatch = this.escapeTelegramMarkdownV2(event.orderBatch);
    const operator = this.escapeTelegramMarkdownV2(event.operatorName);
    const scannedBatch = event.scannedComponentBatch
      ? this.escapeTelegramMarkdownV2(event.scannedComponentBatch)
      : undefined;

    const lines = [
      '🚨 *ОШИБКА СКАНИРОВАНИЯ* 🚨',
      '━━━━━━━━━━━━━━━━━━',
      '',
      '⚠️ *Критическое несоответствие*',
      '',
      `🟢 *Ожидался:* \`${required}\``,
      `🔴 *Отсканирован:* \`${scanned}\``,
      '',
      '━━━━━━━━━━━━━━━━━━',
      '📦 *Контекст операции*',
      '',
      `🧾 Заказ: *${orderBatch}*`,
      `🏷 Партия заказа: *${orderName}*`,
      `👷 Оператор: *${operator}*`,
    ];

    if (scannedBatch) {
      lines.push(`📌 Партия сканированного компонента: *${scannedBatch}*`);
    }

    lines.push('');
    lines.push('❗ *Требуется проверка перед продолжением работы*');

    return lines.join('\n');
  }
  private escapeTelegramMarkdownV2(value: string) {
    return value.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
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
}
