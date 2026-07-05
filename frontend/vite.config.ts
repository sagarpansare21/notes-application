/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      '@testing-library/react',
      '@testing-library/dom',
      '@testing-library/jest-dom',
      '@tanstack/react-query',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'zustand',
      'axios',
      'marked',
      'react-router',
      '@base-ui/react',
      '@hookform/resolvers',
      'react-hook-form',
      'sonner',
      'zod'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*'],
      exclude: [
        'src/main.tsx',
        'src/routes.tsx',
        'src/stories/**/*',
        '**/*.stories.tsx',
        '**/*.test.tsx',
        '**/*.test.ts',
        '**/*.d.ts',
        'src/types/**/*',
        'src/assets/**/*',
        '**/*.css',
        '**/*.png',
        '**/*.svg',
        '**/*.ico',
        'src/components/ui/**/*',
        'src/components/layout/**/*',
        'src/containers/**/*',
        'src/lib/**/*',
        'src/pages/**/*',
        'src/providers/**/*'
      ]
    },
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{
              browser: 'chromium'
            }],
            screenshotFailures: false
          }
        }
      },
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          include: ['src/**/*.test.{ts,tsx}'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{
              browser: 'chromium'
            }],
            screenshotFailures: false
          }
        }
      }
    ]
  }
});