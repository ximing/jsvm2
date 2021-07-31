module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./scripts/testSetup.js'],
  testRegex: '\\.test\\.tsx?$',
  collectCoverage: false,
  testEnvironment: 'node',
  coverageReporters: ['lcovonly', 'text'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  // moduleNameMapper: {
  //   'react-platform': 'react-dom',
  // },
};
