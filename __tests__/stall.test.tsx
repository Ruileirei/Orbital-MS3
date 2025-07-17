import * as firestoreService from '@/services/firestoreService';
import * as stallService from '@/services/stallService';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import StallInfo from '../app/stall/[id]/stallIndex';

jest.mock('@/firebase/firebaseConfig', () => ({
  auth: { currentUser: { uid: 'testUserId' } },
}));

jest.mock('@/services/stallService', () => ({
  getPreviewReviews: jest.fn(),
  addReviewForStall: jest.fn(),
  getAllReviews: jest.fn(),
}));


jest.mock('@/services/firestoreService', () => ({
  getStallDoc: jest.fn(),
  getUserDoc: jest.fn(),
  updateUserDoc: jest.fn(),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
  useRouter: jest.fn(),
}));

jest.mock('@rneui/themed', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Icon: (props: { name: string; testID?: string }) => (
      <Text testID={props.testID}>{props.name}</Text>
    ),
  };
});


describe('StallInfo screen', () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: 'test-stall-id',
      title: 'Hainan Chicken Rice',
      cuisine: 'Chinese',
      rating: 4.5,
    });

    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
    });

    (stallService.getPreviewReviews as jest.Mock).mockResolvedValue([
      { id: 'rev1', rating: 5, comment: 'Excellent!', userName: 'Alice', time: { seconds: 1690000000 } },
    ]);

    (firestoreService.getUserDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        favourites: ['test-stall-id'],
      }),
    });

    (firestoreService.getStallDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: 'Hainan Chicken Rice',
        cuisine: 'Chinese',
        rating: 4.5,
        location: 'Block 123',
        openingHours: {
          monday: '08:00 - 20:00'
        },
        menu: ['https://example.com/image.jpg'],
      }),
    });
  });

  it('renders loading', () => {
    (firestoreService.getStallDoc as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<StallInfo />);
    expect(screen.getByText(/Loading stall/i)).toBeTruthy();
  });

  it('renders fallback when no data is available', async () => {
    (firestoreService.getStallDoc as jest.Mock).mockResolvedValue({ exists: () => false });
    render(<StallInfo />);
    expect(await screen.findByText(/Stall data not found/i)).toBeTruthy();
  });

  it('renders stall details', async () => {
    render(<StallInfo />);
    expect(await screen.findByText('Hainan Chicken Rice')).toBeTruthy();
    expect(screen.getByText(/Cuisine: Chinese/)).toBeTruthy();
    expect(screen.getByText(/Location: Block 123/)).toBeTruthy();
    expect(screen.getByText('Menu')).toBeTruthy();
  });

  it('renders status indicator with correct text', async () => {
    render(<StallInfo />);
    const status = await screen.findByText(/Open|Closed|Opening Soon|Closing Soon/);
    expect(status).toBeTruthy();
  });

  it('renders saved heart icon', async () => {
    render(<StallInfo />);
    const heartIcon = await screen.findByTestId('heart-icon');
    expect(heartIcon).toHaveTextContent('heart');
  });

  it('expands and collapses opening hours', async () => {
    render(<StallInfo />);
    const toggleButton = await screen.findByText(/Open|Closed|Opening Soon|Closing Soon/);
    fireEvent.press(toggleButton);
    expect(screen.getByText(/Monday:/i)).toBeTruthy();
  });

  it('opens image modal when pressed', async () => {
    render(<StallInfo />);
    const button = await screen.findByTestId('menu-image-button');
    fireEvent.press(button);
    expect(await screen.findByTestId('image-modal')).toBeTruthy();
  });

  it('calls router.back when back button pressed', async () => {
    render(<StallInfo />);
    const backButton = await screen.findByTestId('back-button');
    fireEvent.press(backButton);
    expect(mockBack).toHaveBeenCalled();
  });
});
