import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Cast process to any to avoid type errors in some environments where process is not fully typed
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 1. Explicitly replace the API Key
      // FIX: Prioritize GEMINI_API_KEY as per debugging report, fallback to API_KEY
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY),
      // 2. Define a global process object to prevent "ReferenceError: process is not defined"
      // likely caused by dependencies expecting a Node environment.
      'process.env': {},
      // 3. Polyfill global for legacy libraries
      global: 'window',
    },
    build: {
      outDir: 'build',
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});