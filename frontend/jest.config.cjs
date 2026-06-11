const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/tests/unit/**/*.spec.{ts,tsx}'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
};

module.exports = createJestConfig(customJestConfig);
