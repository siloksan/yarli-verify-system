import { z } from 'zod';

export const AppSchema = z.object({
  nodeEnv: z
    .enum(['development', 'production', 'test', 'debug'])
    .default('development'),
  port: z.number().default(3000),
});

export const DatabaseSchema = z.object({
  url: z.string(),
});

export const SwaggerSchema = z.object({
  enabled: z.boolean(),
  title: z.string(),
  description: z.string(),
  version: z.string(),
  path: z.string(),
  openApiVersion: z.string(),
});

export const ConfigSchema = z.object({
  app: AppSchema,
  db: DatabaseSchema,
  swagger: SwaggerSchema,
});

export type Config = z.infer<typeof ConfigSchema>;
export type ConfigKeys = keyof Config;
