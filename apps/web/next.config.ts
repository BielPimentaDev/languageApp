import type { NextConfig } from 'next';
import { loadWebConfig } from './src/web-config';

// Falha cedo, no boot do `next dev`/`next build`, se a configuração do front for inválida.
loadWebConfig(process.env);

const nextConfig: NextConfig = {
  transpilePackages: ['@language-app/shared'],
};

export default nextConfig;
