import { fireEvent, render, waitFor } from '@testing-library/react-native';
import SearchScreen from '../app/SearchScreen';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useLocalSearchParams: () => ({}),
}));

import * as firestore from 'firebase/firestore';

const generateStallDocs = (count) =>
  Array.from({ length: count }).map((_, idx) => ({
    id: `stall${idx + 1}`,
    data: () => ({
      name: `Stall ${idx + 1}`,
      cuisine: 'Generic',
      rating: 4.0,
      openingHours: {},
      latitude: 1.3,
      longitude: 103.8,
    }),
  }));

beforeAll(() => {
  firestore.getDocs.mockImplementation(() =>
    Promise.resolve({
      forEach: (callback) => {
        [
          {
            id: 'stall1',
            data: () => ({
              name: 'Best Chicken Rice',
              cuisine: 'Chicken Rice',
              rating: 4.5,
              openingHours: {},
              latitude: 1.3,
              longitude: 103.8,
            }),
          },
          {
            id: 'stall2',
            data: () => ({
              name: 'Halal BBQ',
              cuisine: 'Halal',
              rating: 4.0,
              openingHours: {},
              latitude: 1.31,
              longitude: 103.81,
            }),
          },
        ].forEach(callback);
      },
    })
  );
});

jest.mock('@/utils/isOpenStatus', () => ({
  getOpenStatus: jest.fn(() => 'OPEN'),
}));

const React = require('react');

jest.mock('@/Components/StallItem', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  return ({ item, onPress }) =>
    React.createElement(
      TouchableOpacity,
      { onPress: () => onPress(item) },
      React.createElement(Text, null, item.title)
    );
});

describe('SearchScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test('shows loading spinner initially', () => {
    const { getByText } = render(<SearchScreen />);
    expect(getByText('Loading stalls...')).toBeTruthy();
  });

  test('renders fetched stall items after load', async () => {
    const { findByText } = render(<SearchScreen />);
    expect(await findByText('Best Chicken Rice')).toBeTruthy();
    expect(await findByText('Halal BBQ')).toBeTruthy();
  });

  test('filters results by search input', async () => {
    const { findByPlaceholderText, findByText, queryByText } = render(<SearchScreen />);
    await findByText('Best Chicken Rice');

    const searchInput = await findByPlaceholderText('Search for food...');
    fireEvent.changeText(searchInput, 'Halal');

    expect(await findByText('Halal BBQ')).toBeTruthy();
    expect(queryByText('Best Chicken Rice')).toBeNull();
  });

  test('shows empty state if no matches', async () => {
    const { findByPlaceholderText, findByText } = render(<SearchScreen />);
    await findByText('Best Chicken Rice');

    const searchInput = await findByPlaceholderText('Search for food...');
    fireEvent.changeText(searchInput, 'NonExistentStall');

    expect(await findByText('No match found')).toBeTruthy();
  });

  test('clicking stall item navigates to details', async () => {
    const { findByText } = render(<SearchScreen />);
    const stallItem = await findByText('Best Chicken Rice');
    fireEvent.press(stallItem);

    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/stall/[id]',
        params: expect.objectContaining({
          id: 'stall1',
          title: 'Best Chicken Rice',
          cuisine: 'Chicken Rice',
          rating: '4.5',
        }),
      })
    );
  });

  test('clicking filter button navigates with correct params', async () => {
    const { findByLabelText, findByText, getByTestId } = render(<SearchScreen />);
    await findByText('Best Chicken Rice');

    const filterButton = getByTestId('filter-icon');
    fireEvent.press(filterButton);

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/filter'));
  });
});

describe('SearchScreen pagination controls', () => {
  beforeEach(() => {
    mockPush.mockClear();

    firestore.getDocs.mockImplementation(() =>
      Promise.resolve({
        forEach: (callback) => {
          generateStallDocs(25).forEach(callback);
        },
      })
    );
  });

  test('renders first page with correct stalls', async () => {
    const { findByText, queryByText } = render(<SearchScreen />);
    expect(await findByText('Stall 1')).toBeTruthy();
    expect(await findByText('Stall 10')).toBeTruthy();
    expect(queryByText('Stall 11')).toBeNull();
  });

  test('next button moves to page 2', async () => {
    const { findByText, getByText, queryByText } = render(<SearchScreen />);
    await findByText('Stall 1');

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Stall 11')).toBeTruthy();
      expect(queryByText('Stall 1')).toBeNull();
    });
  });

  test('prev button returns to page 1', async () => {
    const { findByText, getByText } = render(<SearchScreen />);
    await findByText('Stall 1');

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    await findByText('Stall 11');

    const prevButton = getByText('Prev');
    fireEvent.press(prevButton);
    await findByText('Stall 1');
  });

  test('clicking page number navigates to that page', async () => {
    const { findByText, getByText } = render(<SearchScreen />);
    await findByText('Stall 1');

    const page3Button = getByText('3');
    fireEvent.press(page3Button);

    await waitFor(() => {
      expect(getByText('Stall 21')).toBeTruthy();
    });
  });

  test('disables Prev on first page and Next on last page', async () => {
    const { findByText, getByText } = render(<SearchScreen />);
    await findByText('Stall 1');

    expect(getByText('Prev').props.style).toEqual(
      expect.objectContaining({ color: 'gray' })
    );

    const page3Button = getByText('3');
    fireEvent.press(page3Button);
    await findByText('Stall 21');

    expect(getByText('Next').props.style).toEqual(
      expect.objectContaining({ color: 'gray' })
    );
  });
});
