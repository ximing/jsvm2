module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./scripts/testSetup.js'],
  testRegex: '\\.test\\.tsx?$',
  collectCoverage: false,
  testEnvironment: 'node',
  coverageReporters: ['lcovonly', 'text'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/src/index.ts',
    '.mock.ts',
    '<rootDir>/src/context.ts',
  ],
  // moduleNameMapper: {
  //   'react-platform': 'react-dom',
  // },
};
