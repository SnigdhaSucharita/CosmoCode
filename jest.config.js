module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'controller/**/*.js',
    'utils/**/*.js',
    'validations/**/*.js',
  ],
};
