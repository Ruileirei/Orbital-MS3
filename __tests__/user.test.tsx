import UserPage from '@/app/user';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';

jest.mock('expo-router', () => {
  const actual = jest.requireActual('expo-router');
  const React = require('react');
  return {
    ...actual,
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn(() => ({})),
    useFocusEffect: jest.fn((cb) => {
      React.useEffect(() => {
        const cleanup = cb();
        return typeof cleanup === 'function' ? cleanup : undefined;
      }, []);
    }),
  };
});

jest.mock('@/firebase/firebaseConfig', () => ({
  auth: {
    currentUser: { uid: 'mock-user-id' },
  },
  db: {},
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

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }: any) => <>{children}</>,
    SafeAreaView: ({ children }: any) => <>{children}</>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

const renderWithNavigation = () =>
  render(
    <NavigationContainer>
      <UserPage />
    </NavigationContainer>
  );

describe('UserPage', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: mockReplace });
    jest.clearAllMocks();
  });

  it('shows loading screen initially', () => {
    const { getByText } = renderWithNavigation();
    expect(getByText('Loading your profile...')).toBeTruthy();
  });

  it('displays user data after load', async () => {
    const { getByTestId, queryByText } = renderWithNavigation();
    await waitFor(() => expect(queryByText('Loading your profile...')).toBeNull());

    expect(getByTestId('fav-stall-stall-1')).toBeTruthy();
    expect(getByTestId('review-review-1')).toBeTruthy();
  });

  it('displays default user profile fields when missing', async () => {
    const userService = require('@/services/userService');
    userService.fetchUserProfile.mockResolvedValueOnce({
        username: null,
        email: null,
        pfp: null,
        favourites: [],
    });

    const { getByText } = renderWithNavigation();

    await waitFor(() => {
        expect(getByText('Default User')).toBeTruthy();
        expect(getByText('Default@gmail.com')).toBeTruthy();
    });
  });


  it('navigates to stall detail screen on stall press', async () => {
    const { getByTestId } = renderWithNavigation();
    const favStall = await waitFor(() => getByTestId('fav-stall-stall-1'));

    fireEvent.press(favStall);

    expect(mockPush).toHaveBeenCalledWith({
        pathname: '/stall/[id]/stallIndex',
        params: { id: 'stall-1', title: 'Mock Stall 1' },
    });
  });


  it('navigates to Edit Profile screen', async () => {
    const { getByText } = renderWithNavigation();
    await waitFor(() => getByText('Edit Profile'));

    fireEvent.press(getByText('Edit Profile'));
    expect(mockPush).toHaveBeenCalledWith('/editProfile');
  });

  it('navigates to user saved stalls screen', async () => {
    const { getByTestId } = renderWithNavigation();
    const arrowButton = await waitFor(() => getByTestId('navigate-saved-stalls'));

    fireEvent.press(arrowButton);
    expect(mockPush).toHaveBeenCalledWith('/userSavedStalls');
  });

  it('triggers logout alert', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByTestId } = renderWithNavigation();
    const logoutButton = await waitFor(() => getByTestId('logout-button'));

    fireEvent.press(logoutButton);
    expect(alertSpy).toHaveBeenCalledWith(
      'Logout',
      'Are you sure you want to logout?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'cancel' }),
        expect.objectContaining({
          text: 'Logout',
          style: 'destructive',
          onPress: expect.any(Function),
        }),
      ])
    );
  });
});
