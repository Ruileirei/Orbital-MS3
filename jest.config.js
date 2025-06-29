module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?|react-native-safe-area-context|@react-navigation)',
  ],
  testEnvironment: 'node',
  testEnvironmentOptions: {
    node: '16'
  }
};




