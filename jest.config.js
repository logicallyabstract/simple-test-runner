module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.ts',
    '!src/cli.ts',
    '!integration/**/*',
    '!dist/**/*',
    '!src/browser-helpers/**/*',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      lines: 80,
    },
  },
};
