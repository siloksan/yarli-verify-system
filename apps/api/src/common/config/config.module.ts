import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { ENV_CONFIG_DEVELOPMENT } from './constant/env.constant';
import { Config, ConfigSchema } from './config.schema';
import { z } from 'zod';

// Create different schemas based on environment
function getDevelopmentConfig() {
  validateConfig(ENV_CONFIG_DEVELOPMENT);
  return ENV_CONFIG_DEVELOPMENT;
}
function getProductionConfig() {
  // TODO: Replace with actual production config
  validateConfig(ENV_CONFIG_DEVELOPMENT);
  return ENV_CONFIG_DEVELOPMENT;
}

const configModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
  load: [
    () =>
      process.env.NODE_ENV === 'production'
        ? getProductionConfig()
        : getDevelopmentConfig(),
  ],
};

function validateConfig(config: Config) {
  const result = ConfigSchema.safeParse(config);
  if (!result.success) {
    const pretty = z.prettifyError(result.error);
    const errorMessage = `Config validation failed: ${pretty}`;
    throw new Error(errorMessage);
  }
}

@Module({
  imports: [NestConfigModule.forRoot(configModuleOptions)],
  providers: [ConfigService],
  exports: [NestConfigModule, ConfigService],
})
export class ConfigModule {}
