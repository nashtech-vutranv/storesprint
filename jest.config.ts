import type {Config} from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  moduleNameMapper: {
    'react-i18next': '<rootDir>/src/__mocks__/react-i18next.ts',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileTransformer.js',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  setupFilesAfterEnv: ['./src/jest.setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    './src/components/**',
    './src/layouts/**',
    './src/pages/**',
    // './src/routes/**',
    '!./src/**/*.ts',
    '!./src/**/index.tsx',
    '!./src/**/*.snap',
    '!./src/**/*.stories.tsx',
  ],
  testResultsProcessor: 'jest-sonar-reporter',
}
export default config
