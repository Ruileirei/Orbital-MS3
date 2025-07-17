process.env.EXPO_OS = 'ios';

import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDoc } from 'firebase/firestore';
import React from 'react';
import GroupPage from '../app/group/[id]';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
  useRouter: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe('GroupPage', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: 'test-group-id',
    });
  });

  it('shows loading spinner initially', async () => {
    (getDoc as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<GroupPage />);
    await waitFor(() => {
      expect(screen.getByText(/Loading group stalls/i)).toBeTruthy();
    });
});


  it('shows empty message when no stalls found', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ name: 'Test Group', stalls: [] }),
    });
    render(<GroupPage />);
    expect(await screen.findByText(/No stalls found/i)).toBeTruthy();
  });

  it('renders stalls when data available', async () => {
    (getDoc as jest.Mock)
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ name: 'Test Group', stalls: ['stall-1'] }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        id: 'stall-1',
        data: () => ({
          name: 'Mock Stall 1',
          cuisine: 'Chinese',
          menu: ['https://example.com/image.png'],
        }),
      });

    render(<GroupPage />);

    expect(await screen.findByText('Mock Stall 1')).toBeTruthy();
    expect(screen.getByText('Chinese')).toBeTruthy();
  });

  it('calls router.back when back button pressed', async () => {
    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ name: 'Test Group', stalls: [] }),
    });

    render(<GroupPage />);

    const backButton = await screen.findByTestId('back-button');
    fireEvent.press(backButton);

    await waitFor(() => {
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it('navigates to individual stall when pressed', async () => {
    (getDoc as jest.Mock)
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ name: 'Test Group', stalls: ['stall-1'] }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        id: 'stall-1',
        data: () => ({
          name: 'Mock Stall 1',
          cuisine: 'Chinese',
          menu: ['https://example.com/image.png'],
        }),
      });

    render(<GroupPage />);

    const stallItem = await screen.findByText('Mock Stall 1');
    fireEvent.press(stallItem);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/stall/[id]/stallIndex',
          params: expect.objectContaining({ id: 'stall-1' }),
        })
      );
    });
  });
});
