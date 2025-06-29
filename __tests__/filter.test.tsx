import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { getDocs } from 'firebase/firestore';
import React from 'react';
import FilterScreen from '../app/filter';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

describe('FilterScreen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });

    (getDocs as jest.Mock).mockResolvedValue({
      forEach: (cb: any) => {
        cb({ data: () => ({ cuisine: 'Chinese' }) });
        cb({ data: () => ({ cuisine: 'Malay' }) });
      },
    });
  });

  it('renders correctly', async () => {
    render(<FilterScreen />);

    await waitFor(() => {
        expect(screen.getByText(/Filter/i)).toBeTruthy();
        expect(screen.getByText(/Sort by Rating/i)).toBeTruthy();
        expect(screen.getByText(/By Cuisine/i)).toBeTruthy();
        expect(screen.getByText(/Miscellaneous/i)).toBeTruthy();
    });

  });

  it('renders cuisine options from Firestore', async () => {
    render(<FilterScreen />);

    await waitFor(() => {
      expect(getDocs).toHaveBeenCalled();
    });
  });

  it('handles Clear button', async () => {
    render(<FilterScreen />);

    await waitFor(() => expect(getDocs).toHaveBeenCalled());

    const clearButton = screen.getByText('Clear');
    fireEvent.press(clearButton);

    expect(screen.getByText('Apply (0)')).toBeTruthy();
  });

  it('handles Apply button', async () => {
    render(<FilterScreen />);

    await waitFor(() => expect(getDocs).toHaveBeenCalled());

    const applyButton = screen.getByText(/Apply/i);
    fireEvent.press(applyButton);

    expect(mockPush).toHaveBeenCalled();
  });
});
