import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Cast process to any to avoid type errors
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 1. Explicitly replace the API Key (Prioritize GEMINI_API_KEY)
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY),
      // 2. Polyfill global for legacy libraries
      global: 'window',
      // 3. Robust process.env polyfill
      // Prevents "process is not defined" in some libraries
      'process.env': {} 
    },
    build: {
      outDir: 'build',
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});