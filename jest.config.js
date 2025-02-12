module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/tests/",
    "/config/",
    "/public/",
  ],
  verbose: true,
  maxWorkers: 1,
  testTimeout: 30000,
  clearMocks: true,
  resetModules: true,
};
