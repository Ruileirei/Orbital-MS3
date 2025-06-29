import { render, screen } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import StallInfo from '../app/stall/[id]';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
}));

describe('StallInfo with Firebase mocked completely', () => {
  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: 'test-stall-id',
      title: 'Hainan Chicken Rice',
      cuisine: 'Chinese',
      rating: 4.5,
    });
  });

  it('renders fallback when no data is available', async () => {
    render(<StallInfo />);
    expect(await screen.findByText(/Stall data not found/i)).toBeTruthy();
  });
});
