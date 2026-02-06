import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { ConfigModule } from '../config/config.module';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [ConfigModule],
})
export class PrismaModule {}
