import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	resolve: {
    alias: {
      // "common": path.resolve(__dirname, "../common"),
    }
  }
});
