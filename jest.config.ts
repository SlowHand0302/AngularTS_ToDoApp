import type { Config } from 'jest';

const config: Config = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/src'], // Points to all projects
    testMatch: ['**/+(*.)+(spec).+(ts)'],
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'], // Global setup
    moduleNameMapper: {
        '^@carbon/icons/es/(.*)$': '@carbon/icons/lib/$1.js',
        // '@ng-icons/core': '<rootDir>/__mocks__/ng-icons-core.js', // Mock @ng-icons/core
    },
    transformIgnorePatterns: ['/node_modules/(?!.*\\.mjs$|carbon-components-angular|@carbon/icons/es|lodash-es)'],
};

export default config;
