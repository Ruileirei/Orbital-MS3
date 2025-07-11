jest.mock('@/src/hooks/useStalls', () => ({
  useStalls: jest.fn(),
}));

import { useStalls } from '@/src/hooks/useStalls';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import SearchScreen from '../app/search';

describe('SearchScreen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });
  });

  it('renders loading state initially', () => {
    (useStalls as jest.Mock).mockReturnValue({
      stalls: [],
      loading: true,
      error: null,
    });

    render(<SearchScreen />);
    expect(screen.getByText(/Loading stalls/i)).toBeTruthy();
  });

  it('renders stalls after loading', async () => {
    (useStalls as jest.Mock).mockReturnValue({
      stalls: [
        {
          id: 'stall-1',
          title: 'Mock Stall 1',
          cuisine: 'Chinese',
          rating: 4.5,
          openingHours: {},
          latitude: 0,
          longitude: 0,
        },
        {
          id: 'stall-2',
          title: 'Mock Stall 2',
          cuisine: 'Malay',
          rating: 4.0,
          openingHours: {},
          latitude: 0,
          longitude: 0,
        },
      ],
      loading: false,
      error: null,
    });

    render(<SearchScreen />);

    expect(screen.queryByText(/Loading stalls/i)).toBeNull();
    expect(screen.getByText('Mock Stall 1')).toBeTruthy();
    expect(screen.getByText('Mock Stall 2')).toBeTruthy();
  });

  it('filters stalls by search input', async () => {
    (useStalls as jest.Mock).mockReturnValue({
      stalls: [
        {
          id: 'stall-1',
          title: 'Mock Stall 1',
          cuisine: 'Chinese',
          rating: 4.5,
          openingHours: {},
          latitude: 0,
          longitude: 0,
        },
        {
          id: 'stall-2',
          title: 'Mock Stall 2',
          cuisine: 'Malay',
          rating: 4.0,
          openingHours: {},
          latitude: 0,
          longitude: 0,
        },
      ],
      loading: false,
      error: null,
    });

    render(<SearchScreen />);

    const input = screen.getByPlaceholderText('Search for food...');
    fireEvent.changeText(input, 'Mock Stall 1');

    expect(screen.getByText('Mock Stall 1')).toBeTruthy();
    expect(screen.queryByText('Mock Stall 2')).toBeNull();
  });

  it('shows empty component when no matches', () => {
    (useStalls as jest.Mock).mockReturnValue({
      stalls: [
        {
          id: 'stall-1',
          title: 'Mock Stall 1',
          cuisine: 'Chinese',
          rating: 4.5,
          openingHours: {},
          latitude: 0,
          longitude: 0,
        },
      ],
      loading: false,
      error: null,
    });

    render(<SearchScreen />);

    const input = screen.getByPlaceholderText('Search for food...');
    fireEvent.changeText(input, 'Nonexistent Stall');

    expect(screen.getByText('No match found')).toBeTruthy();
  });

  it('handles filter button press', () => {
    (useStalls as jest.Mock).mockReturnValue({
      stalls: [
        {
          id: 'stall-1',
          title: 'Mock Stall 1',
          cuisine: 'Chinese',
          rating: 4.5,
          openingHours: {},
          latitude: 0,
          longitude: 0,
        },
      ],
      loading: false,
      error: null,
    });

    render(<SearchScreen />);

    const button = screen.getByTestId('filter-button');
    fireEvent.press(button);

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/filter?'));
  });

  it('renders pagination controls when many stalls exist', () => {
    const manyStalls = Array.from({ length: 25 }, (_, i) => ({
      id: `stall-${i}`,
      title: `Mock Stall ${i}`,
      cuisine: 'Chinese',
      rating: 4.5,
      openingHours: {},
      latitude: 0,
      longitude: 0,
    }));

    (useStalls as jest.Mock).mockReturnValue({
      stalls: manyStalls,
      loading: false,
      error: null,
    });
    render(<SearchScreen />);
    expect(screen.getByText('Prev')).toBeTruthy();
    expect(screen.getByText('Next')).toBeTruthy();
  });

  it('navigates to stall detail when stall is pressed', () => {
    (useStalls as jest.Mock).mockReturnValue({
      stalls: [
        {
          id: 'stall-1',
          title: 'Mock Stall 1',
          cuisine: 'Chinese',
          rating: 4.5,
          openingHours: {},
          latitude: 0,
          longitude: 0,
        },
      ],
      loading: false,
      error: null,
    });

    render(<SearchScreen />);

    fireEvent.press(screen.getByTestId('stall-item-stall-1'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/stall/[id]',
      params: {
        id: 'stall-1',
        title: 'Mock Stall 1',
        cuisine: 'Chinese',
        rating: '4.5',
      },
    });
  });
});


