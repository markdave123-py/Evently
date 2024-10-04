// export default {
//   testEnvironment: "node",
//   setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
//   testMatch: ["**/tests/**/*.test.js"],
//   verbose: true,
//   transform: {
//     "^.+\\.js$": "babel-jest", // Transpile JS files using babel-jest
//   },
// };


export default {
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "cjs"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testMatch: ["**/tests/**/*.test.js", "**/tests/**/*.test.cjs"],
  verbose: true,
  transform: {
    "^.+\\.js$": "babel-jest", // Use Babel to transpile ES module files
  },
};
