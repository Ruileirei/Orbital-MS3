import { render, screen, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { getDocs } from 'firebase/firestore';
import React from 'react';
import MapScreen from '../app/Map';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(() => ({
    mode: 'all'
  })),
  usePathname: jest.fn(() => '/'),
}));


jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: ({ children }: any) => <View testID="MapView">{children}</View>,
    Marker: ({ children }: any) => <View testID="Marker">{children}</View>,
    Callout: ({ children }: any) => <View testID="Callout">{children}</View>,
  };
});

describe('MapScreen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });
  });

  it('renders loading initially', () => {
    (getDocs as jest.Mock).mockImplementation(() => new Promise(() => {})); // hanging promise

    render(<MapScreen />);
    expect(screen.getByText(/Loading/i)).toBeTruthy();
  });

  it('renders markers after loading', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        {
          id: 'stall-1',
          data: () => ({
            name: 'Mock Stall 1',
            cuisine: 'Chinese',
            rating: 4.5,
            latitude: 1.3521,
            longitude: 103.8198,
          }),
        },
        {
          id: 'stall-2',
          data: () => ({
            name: 'Mock Stall 2',
            cuisine: 'Malay',
            rating: 4.0,
            latitude: 1.3525,
            longitude: 103.8200,
          }),
        },
      ],
    });

    render(<MapScreen />);

    await waitFor(() => {
      expect(screen.getAllByTestId('Marker').length).toBe(2);
    });
  });

  it('has MapView component', async () => {
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [],
    });

    render(<MapScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('MapView')).toBeTruthy();
    });
  });
});
