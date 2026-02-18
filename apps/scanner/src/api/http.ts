import { createHttp } from '@repo/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    'Missing environment variable EXPO_PUBLIC_API_BASE_URL (or API_BASE_URL fallback)',
  );
}

export const http = createHttp(API_BASE_URL);
