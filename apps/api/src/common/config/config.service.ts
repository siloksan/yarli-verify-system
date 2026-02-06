import { Injectable, Inject } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Config, ConfigKeys } from './config.schema';

@Injectable()
export class ConfigService {
  constructor(
    @Inject(NestConfigService)
    private readonly configService: NestConfigService,
  ) {}

  get<T extends Config[ConfigKeys]>(key: ConfigKeys): T {
    const value = this.configService.get<T>(key);
    if (value === undefined) {
      throw new Error(`Configuration key ${key} is undefined`);
    }
    return value;
  }

  getAllConfig(): Config {
    return this.configService.get<Config>(undefined, { infer: true });
  }
  getAppConfig() {
    return this.get<Config['app']>('app');
  }

  getDBConfig() {
    return this.get<Config['db']>('db');
  }

  getSwaggerConfig() {
    return this.get<Config['swagger']>('swagger');
  }
}
