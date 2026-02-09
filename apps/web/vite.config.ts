import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import fs from 'fs';
import path from 'path';

const readHttpsConfig = () => {
  const certPath = process.env.VITE_DEV_CERT;
  const keyPath = process.env.VITE_DEV_KEY;

  if (!certPath || !keyPath) return undefined;

  const resolvedCert = path.resolve(certPath);
  const resolvedKey = path.resolve(keyPath);

  if (!fs.existsSync(resolvedCert) || !fs.existsSync(resolvedKey)) {
    return undefined;
  }

  return {
    cert: fs.readFileSync(resolvedCert),
    key: fs.readFileSync(resolvedKey),
  };
};

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    include: ['@repo/api'],
  },
  server: {
    https: readHttpsConfig(),
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    host: true,
    port: 5173,
  },
});
