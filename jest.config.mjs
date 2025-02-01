export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^#core/engine\\.js$': '<rootDir>/src/core/__mocks__/engine.ts',
    '^#core/components/Inventory\\.js$': '<rootDir>/src/core/components/__mocks__/Inventory.ts',
    '^#core/mechanics/trump/components/TrumpResults\\.js$': '<rootDir>/src/core/mechanics/trump/components/__mocks__/TrumpResults.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  extensionsToTreatAsEsm: ['.ts']
};
