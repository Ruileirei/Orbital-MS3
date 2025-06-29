module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
  'node_modules/(?!(expo|@expo|expo-.*|firebase|@firebase/.*|@firebase|react-native|@react-native|@react-navigation|react-native-.*|@rneui)/)',
],

  setupFiles: ['./jest.setup.js'],
};




