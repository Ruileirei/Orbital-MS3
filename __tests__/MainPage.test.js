import { fireEvent, render } from '@testing-library/react-native';
import MainPage from './app/MainPage';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/firebase/firebaseConfig', () => ({
  auth: { currentUser: { uid: '123' } },
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({ exists: () => true, data: () => ({ username: 'TestUser' }) })
  ),
  collection: jest.fn(),
  getDocs: jest.fn(() =>
    Promise.resolve({
      docs: [
        {
          id: 'stall1',
          data: () => ({
            name: 'Stall of the Day',
            cuisine: 'Chinese',
            openingHours: {},
            menu: [],
            rating: 4.5,
          }),
        },
        {
          id: 'stall2',
          data: () => ({
            name: 'Open Stall',
            cuisine: 'Malay',
            openingHours: {},
          }),
        },
      ],
    })
  ),
}));

jest.mock('@/utils/isOpenStatus', () => ({
  getOpenStatus: jest.fn(() => 'OPEN'),
}));

describe('MainPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test('shows loading screen initially', () => {
    const { getByText } = render(<MainPage />);
    expect(getByText('Loading Hawker stalls...')).toBeTruthy();
  });

  test('renders greeting with username after loading', async () => {
    const { findByText } = render(<MainPage />);
    expect(await findByText('Hi TestUser')).toBeTruthy();
  });

  test('renders categories', async () => {
    const { findByText } = render(<MainPage />);
    expect(await findByText('Browse by Category')).toBeTruthy();
    expect(await findByText('Halal')).toBeTruthy();
    expect(await findByText('Barbeque')).toBeTruthy();
  });

  test('clicking category navigates', async () => {
    const { findByText } = render(<MainPage />);
    const categoryButton = await findByText('Halal');
    fireEvent.press(categoryButton);

    expect(mockPush).toHaveBeenCalled();
  });

  test('renders Stall of the Day section', async () => {
    const { findByText } = render(<MainPage />);
    expect(await findByText('Stall of the Day')).toBeTruthy();
    expect(await findByText('Stall of the Day')).toBeTruthy();
  });

  test('clicking Stall of the Day navigates', async () => {
    const { findByText } = render(<MainPage />);
    const stallButton = await findByText('Stall of the Day');
    fireEvent.press(stallButton);

    expect(mockPush).toHaveBeenCalled();
  });

  test('renders Open Now section and stalls', async () => {
    const { findByText } = render(<MainPage />);
    expect(await findByText('Open Now')).toBeTruthy();
    expect(await findByText('Open Stall')).toBeTruthy();
  });

  test('clicking See More navigates to search', async () => {
    const { findByText } = render(<MainPage />);
    const seeMoreButton = await findByText('See More');
    fireEvent.press(seeMoreButton);

    expect(mockPush).toHaveBeenCalledWith('/search?hideClosed=true');
  });

  test('clicking SearchBar navigates to search screen', async () => {
    const { findByText } = render(<MainPage />);
    const searchPrompt = await findByText('Search for hawker food...');
    fireEvent.press(searchPrompt);

    expect(mockPush).toHaveBeenCalledWith('./search');
  });
});
