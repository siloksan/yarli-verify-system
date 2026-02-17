import { createHttp } from '@repo/api';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('Missing environment variables API_BASE_URL');
}

export const http = createHttp(API_BASE_URL);
