import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
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
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    __esModule: true,
    default: ({ children }: any) => <View testID="MapView">{children}</View>,
    Marker: ({ onPress, children }: any) => (
      <TouchableOpacity testID="Marker" onPress={onPress}>
        {children}
      </TouchableOpacity>
    ),
    Callout: ({ children }: any) => <View testID="Callout">{children}</View>,
  };
});

describe('MapScreen', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
      replace: jest.fn(),
    });
  });

  it('renders loading initially', () => {
    (getDocs as jest.Mock).mockImplementation(() => new Promise(() => {}));
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

  it('renders MapView component', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    render(<MapScreen />);
    await waitFor(() => {
      expect(screen.getByTestId('MapView')).toBeTruthy();
    });
  });

  it('navigates to searchOptions when search bar is pressed', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    render(<MapScreen />);

    const searchButton = await screen.findByText(/Search for places/i);
    fireEvent.press(searchButton.parent);

    expect(mockPush).toHaveBeenCalledWith('/searchOptions');
  });

  it('calls router.back when back button is pressed', async () => {
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    render(<MapScreen />);

    const backButton = await screen.findByTestId('arrow-left-button');
    fireEvent.press(backButton);
    expect(mockBack).toHaveBeenCalled();
  });

  it('shows modal when pressed', async () => {
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
      ],
    });

    render(<MapScreen />);
    const marker = await screen.findByTestId('Marker');
    fireEvent.press(marker);
    const modalName = await screen.findByTestId('modal-stall-name');
    expect(modalName).toHaveTextContent('Mock Stall 1');

    const modalCuisine = await screen.findByTestId('modal-stall-cuisine');
    expect(modalCuisine).toBeTruthy();
  });

  it('pressing See More navigates to stall page', async () => {
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
      ],
    });

    render(<MapScreen />);
    const marker = await screen.findByTestId('Marker');
    fireEvent.press(marker);

    await screen.findByTestId('modal-stall-name');

    const seeMoreButton = await screen.findByText('See More');
    fireEvent.press(seeMoreButton);

    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/stall/[id]/stallIndex',
      params: expect.objectContaining({
        id: 'stall-1',
      }),
    }));
  });

  it('can close modal', async () => {
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
      ],
    });

    render(<MapScreen />);
    const marker = await screen.findByTestId('Marker');
    fireEvent.press(marker);

    await screen.findByTestId('modal-stall-name');

    const closeButton = await screen.findByTestId('close-modal-button');
    fireEvent.press(closeButton);

    expect(screen.queryByTestId('modal-stall-name')).toBeNull();
  });
});