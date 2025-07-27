jest.mock('@/services/firestoreService', () => ({
  fetchUserData: jest.fn(),
  fetchAllStalls: jest.fn(),
}));

jest.mock('@/src/utils/isOpenStatus', () => ({
  getOpenStatus: jest.fn(() => 'OPEN'),
}));

jest.mock('firebase/firestore', () => {
  return {
    getDoc: jest.fn(() =>
      Promise.resolve({
        exists: () => true,
        data: () => ({
          username: 'TestUser',
          favourites: [],
        }),
      })
    ),
    getDocs: jest.fn(() =>
      Promise.resolve({
        docs: [
          { data: () => ({ stallId: 'stall-1', rating: 5 }) }
        ]
      })
    ),
    collection: jest.fn(),
    doc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
  };
});


jest.mock('@/src/Components/CategoryList', () => {
  return () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    const { useRouter } = require('expo-router');
    const router = useRouter();

    return (
      <View>
        <Text>Category List</Text>
        <TouchableOpacity
          testID="category-button"
          onPress={() => router.push(`/group/group-1`)}
        >
          <Text>Mock Category</Text>
        </TouchableOpacity>
      </View>
    );
  };
});


import * as firestoreService from '@/services/firestoreService';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import MainPage from '../app/main';

jest.mock('expo-router', () => {
  const actual = jest.requireActual('expo-router');
  return {
    ...actual,
    useRouter: jest.fn(),
  };
});

describe('MainPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });

    (firestoreService.fetchUserData as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ username: 'TestUser' }),
    });

    (firestoreService.fetchAllStalls as jest.Mock).mockResolvedValue([
      {
        id: 'stall-1',
        name: 'Mock Stall 1',
        cuisine: 'Chinese',
        rating: 4.5,
        openingHours: {
          monday: [{ open: '00:00', close: '23:59' }],
        },
        menu: ['https://example.com/image.png'],
      },
    ]);
  });

  it('renders loading state initially', () => {
    const { getByText } = render(<MainPage />);
    expect(getByText(/Loading Hawker stalls/i)).toBeTruthy();
  });

  it('renders greeting with username', async () => {
    render(<MainPage />);
    await screen.findByText(/Hi TestUser/i);
  });

  it('renders search bar', async () => {
    render(<MainPage />);
    await screen.findByText(/Search for hawker food/i);
  });

  it('renders stall of the day section', async () => {
    render(<MainPage />);
    await screen.findByText(/Stall of the Day/i);
  });

  it('renders Open Now section', async () => {
    render(<MainPage />);
    await screen.findByText(/Open Now/i);
  });

  it('renders See More button', async () => {
    render(<MainPage />);
    await screen.findByText(/See More/i);
  });

  it('navigates to search screen when search bar is pressed', async () => {
    render(<MainPage />);
    const searchButton = await screen.findByText(/Search for hawker food/i);
    fireEvent.press(searchButton.parent!);
    expect(mockPush).toHaveBeenCalledWith('./search');
  });

  it('navigates to group page when category button is pressed', async () => {
    render(<MainPage />);
    const categoryButton = await screen.findByTestId('category-button');
    fireEvent.press(categoryButton);
    expect(mockPush).toHaveBeenCalledWith('/group/group-1');
  });

  it('navigates to stall page when Stall of the Day is pressed', async () => {
    render(<MainPage />);
    const stallOfDayButton = await screen.findByTestId('stall-of-the-day-button');
    fireEvent.press(stallOfDayButton);
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/stall/[id]/stallIndex',
        params: expect.objectContaining({ id: 'stall-1' }),
      })
    );
  });

  it('navigates to stall page when Open Now stall is pressed', async () => {
    render(<MainPage />);
    const openNowButton = await screen.findByTestId('open-now-stall-button-stall-1');
    fireEvent.press(openNowButton);
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/stall/[id]/stallIndex',
        params: expect.objectContaining({ id: 'stall-1' }),
      })
    );
  });


  it('navigates to filtered search page when See More is pressed', async () => {
    render(<MainPage />);
    const seeMore = await screen.findByText(/See More/i);
    fireEvent.press(seeMore);
    expect(mockPush).toHaveBeenCalledWith('/search?hideClosed=true');
  });
});


