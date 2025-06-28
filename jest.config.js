module.exports = {
  preset: 'jest-expo',

  // Tell Jest how to handle TypeScript and JSX/TSX
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  // Include these node_modules for transforming (important for Expo/Firebase)
  transformIgnorePatterns: [
    'node_modules/(?!(expo|@expo|react-native|@react-native|@react-navigation|@firebase)/)',
  ],

  // Optional setup file if you want to add global mocks
  setupFiles: ['./jest.setup.js'],
};
