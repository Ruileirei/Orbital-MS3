
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(() => ({
    cuisine: '',
    hideClosed: 'false',
    sortBy: 'None',
  })),
  usePathname: jest.fn(() => '/'),
}));

jest.mock('@/firebase/firebaseConfig', () => ({
  auth: {
    currentUser: { uid: 'mock-user-id' },
  },
  db: {},
}));

jest.mock('@/services/firebaseAuthService', () => ({
  signIn: jest.fn(() => Promise.resolve({
    user: { uid: 'mock-user-id', email: 'test@example.com' },
  })),
}));

jest.mock('@/services/firebaseRegisterService', () => ({
  registerUser: jest.fn(() => Promise.resolve({
    user: { uid: 'mock-user-id', email: 'test@example.com' },
  })),
  saveUserData: jest.fn(() => Promise.resolve()),
}));
jest.mock('@/services/firestoreService', () => ({
  getStallDoc: jest.fn(() => Promise.resolve({
    exists: () => false,
    data: () => ({}),
  })),
  getUserDoc: jest.fn(() => Promise.resolve({
    exists: () => false,
    data: () => ({}),
  })),
  updateUserDoc: jest.fn(),
  arrayRemove: jest.fn(),
  arrayUnion: jest.fn(),
  fetchUserData: jest.fn(() => Promise.resolve({
    exists: () => false,
    data: () => ({}),
  })),
  fetchAllStalls: jest.fn(() => Promise.resolve([
    {
      id: 'stall-1',
      name: 'Mock Stall 1',
      cuisine: 'Chinese',
      rating: 4.5,
      openingHours: { monday: ['1000-2000'] },
    },
    {
      id: 'stall-2',
      name: 'Mock Stall 2',
      cuisine: 'Malay',
      rating: 4.0,
      openingHours: { monday: ['1000-2000'] },
    },
  ])),
}));

jest.mock('@/src/hooks/useStalls', () => ({
  useStalls: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    ...jest.requireActual('react-native-safe-area-context'),
    SafeAreaProvider: ({ children }) => <>{children}</>,
    SafeAreaView: ({ children }) => <>{children}</>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: { latitude: 1.3521, longitude: 103.8198 }
  })),
}));

jest.mock('@/services/userService', () => ({
  fetchUserProfile: jest.fn(() =>
    Promise.resolve({
      username: 'Mock User',
      email: 'mock@example.com',
      pfp: '',
      favourites: ['stall-1'],
    })
  ),
  fetchFavouriteStalls: jest.fn(() =>
    Promise.resolve([
      { id: 'stall-1', name: 'Mock Stall 1', cuisine: 'Japanese' },
    ])
  ),
  fetchUserReviews: jest.fn(() =>
    Promise.resolve([
      {
        id: 'review-1',
        stallName: 'Mock Stall 1',
        time: { seconds: 1620000000 },
        comment: 'Loved the food!',
        rating: 5,
      },
    ])
  ),
}));