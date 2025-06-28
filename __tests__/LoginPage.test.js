import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../app/index';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
    expect(getByText('Forgot Password?')).toBeTruthy();
  });

  test('allows typing in email and password fields', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  test('shows alert when login button pressed with empty fields', () => {
    const { getByText } = render(<LoginScreen />);
    const loginButton = getByText('Login');

    fireEvent.press(loginButton);

    expect(Alert.alert).toHaveBeenCalledWith("Please enter your email and password");
  });

  test('navigates to register screen on Register link press', () => {
    const mockReplace = jest.fn();
    jest.mock('expo-router', () => ({
      useRouter: () => ({
        replace: mockReplace,
        push: jest.fn(),
      }),
    }));

    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText('Register'));

    expect(mockReplace).toHaveBeenCalled();
  });

  test('navigates to forgot password screen on Forgot Password link press', () => {
    const mockPush = jest.fn();
    jest.mock('expo-router', () => ({
      useRouter: () => ({
        replace: jest.fn(),
        push: mockPush,
      }),
    }));

    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText('Forgot Password?'));

    expect(mockPush).toHaveBeenCalled();
  });

});
