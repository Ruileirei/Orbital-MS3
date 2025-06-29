import { render } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import MainPage from '../app/main';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('MainPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });
  });

  it('renders loading state initially', () => {
    const { getByText } = render(<MainPage />);
    expect(getByText(/Loading Hawker stalls/i)).toBeTruthy();
  });
});

