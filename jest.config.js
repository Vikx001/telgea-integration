/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // so we can `import xxx from '../specs/file.json'`
  moduleNameMapper: {
    '^(.*)\\.json$': '$1'
  },

  // look for tests in tests/**/*.test.ts
  testMatch: ['**/tests/**/*.test.ts']
};
