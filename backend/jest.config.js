module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "controllers/**/*.js",
    "routes/**/*.js",
    "middleware/**/*.js"
  ]
};
