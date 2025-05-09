import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src'], // Points to all projects
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'], // Global setup
  moduleNameMapper: {
    // '^@carbon/icons/es/(.*)$': '@carbon/icons/lib/$1.js',
    '@carbon/icons/es/(.*)': '<rootDir>/__mocks__/carbon-icons.js',
    '@carbon/icons/es/(.*)$': '<rootDir>/__mocks__/carbon-icons.js',
    // '@ng-icons/core': '<rootDir>/__mocks__/ng-icons-core.js', // Mock @ng-icons/core
  },
  transformIgnorePatterns: [
    // Ensure proper transformation for Carbon components and other dependencies
    '/node_modules/(?!.*\\.mjs$|carbon-components-angular|lodash-es)',
    '/node_modules/(?!.*\\.mjs$|carbon-components-angular|@carbon/icons/es|lodash-es)',
  ],
};

export default config;
