import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // Define process.env.API_KEY global for the browser code to use
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Fallback for other process.env usage if necessary (though API_KEY is the main one)
      'process.env': {} 
    },
    build: {
      outDir: 'build', // Matches vercel.json outputDirectory
    },
  };
});