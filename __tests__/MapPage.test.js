import { fireEvent, render, waitFor } from '@testing-library/react-native';
import MapScreen from '../app/Map';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock('@/firebase/firebaseConfig', () => ({
  db: {},
}));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() =>
    Promise.resolve({
      docs: [
        {
          id: 'stall1',
          data: () => ({
            name: 'Test Stall 1',
            cuisine: 'Chinese',
            rating: 4.5,
            latitude: 1.3,
            longitude: 103.8,
          }),
        },
        {
          id: 'stall2',
          data: () => ({
            name: 'Test Stall 2',
            cuisine: 'Malay',
            rating: 4.0,
            latitude: 1.31,
            longitude: 103.81,
          }),
        },
      ],
    })
  ),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 1.3,
        longitude: 103.8,
      },
    })
  ),
}));

const mockAnimate = jest.fn();
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      animateToRegion: mockAnimate,
    }));
    return <View {...props}>{props.children}</View>;
  });
  const Mock = (props) => <View {...props}>{props.children}</View>;
  Mock.Marker = Mock;
  Mock.Callout = Mock;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: Mock,
    Callout: Mock,
  };
});

describe('MapScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockAnimate.mockClear();
  });

  test('shows loading screen initially', () => {
    const { getByText } = render(<MapScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  test('renders multiple stall markers after loading', async () => {
    const { findByText } = render(<MapScreen />);
    expect(await findByText('Test Stall 1')).toBeTruthy();
    expect(await findByText('Test Stall 2')).toBeTruthy();
  });

  test('search bar navigates to searchOptions', async () => {
    const { findByText } = render(<MapScreen />);
    const searchBar = await findByText('Search for places...');
    fireEvent.press(searchBar);
    expect(mockPush).toHaveBeenCalledWith('/searchOptions');
  });

  test('clicking user location button triggers map animation', async () => {
    const { findByA11yRole, findByText } = render(<MapScreen />);
    await findByText('Test Stall 1'); // Wait for load
    const navButton = await findByA11yRole('button');
    fireEvent.press(navButton);
    expect(mockAnimate).toHaveBeenCalled();
  });

  test('selected stall modal renders with details and navigates', async () => {
    const { findByText, queryByText } = render(<MapScreen />);

    const stall = await findByText('Test Stall 1');
    fireEvent.press(stall);

    await waitFor(() => {
      expect(queryByText('See More')).toBeTruthy();
      expect(queryByText('Test Stall 1')).toBeTruthy();
      expect(queryByText('Chinese')).toBeTruthy();
      expect(queryByText('4.5')).toBeTruthy();
    });

    const seeMoreButton = await findByText('See More');
    fireEvent.press(seeMoreButton);

    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/stall/[id]',
        params: expect.objectContaining({
          id: 'stall1',
          title: 'Test Stall 1',
          cuisine: 'Chinese',
          rating: '4.5',
        }),
      })
    );
  });

  test('modal closes when close button pressed', async () => {
    const { findByText, getByText, queryByText } = render(<MapScreen />);

    const stall = await findByText('Test Stall 1');
    fireEvent.press(stall);

    const closeButton = await findByText('See More');
    expect(closeButton).toBeTruthy();

    const xButton = getByText((content, element) => {
      return element.props.onPress && element.props.children?.props?.name === 'x';
    });
    fireEvent.press(xButton);

    await waitFor(() => {
      expect(queryByText('See More')).toBeNull();
    });
  });
});
