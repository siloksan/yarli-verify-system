import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { ConfigService } from './common/config/config.service';
import { ConfigModule } from './common/config/config.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { OrdersModule } from './modules/orders/orders.module';
import { ComponentsModule } from './modules/components/components.module';
import { BatchesModule } from './modules/batches/batches.module';
import { ScanEventsModule } from './modules/scan-events/scan-events.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.getAppConfig();
        const isProduction = appConfig.nodeEnv === 'production';

        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    OrdersModule,
    ComponentsModule,
    BatchesModule,
    ScanEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
