import { Module } from '@nestjs/common';

import { PrismaModule } from './common/prisma/prisma.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [PrismaModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
