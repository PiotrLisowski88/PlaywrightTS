import type { GitHubActionOptions } from '@estruyf/github-actions-reporter'

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  fullyParallel: true,
  workers: 2,
  reporter: process.env.CI
    ? [
        ['list'],
        [
          '@estruyf/github-actions-reporter',
          <GitHubActionOptions>{
            useDetails: true
          }
        ],
        ['html']
      ]
    : [['list'], ['html']],
  use: {
    viewport: { width: 1440, height: 1024 },
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    trace: process.env.CI ? 'off' : 'retain-on-failure',
    video: 'off',

    actionTimeout: 15000
  },

  timeout: 10 * 60 * 1000,
  expect: { timeout: 30000 },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium'
      },
      testMatch: 'tests/**/*.spec.ts'
    }
  ]
})
