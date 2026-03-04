import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import fs from 'node:fs';
import path from 'node:path';

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
    exclude: ['@repo/api'], // this option prevents Vite cashing it inside .vite, otherwise get an error after adding a new type
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
    allowedHosts: ['rsjzn4-5173.csb.app'],
  },
});
