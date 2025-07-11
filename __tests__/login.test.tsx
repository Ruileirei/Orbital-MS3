import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import LoginScreen from '../app/index';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockReplace = jest.fn();
  const mockPush = jest.fn();
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();

    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      push: mockPush,
    });
  });

  it('renders email and password fields', () => {
    render(<LoginScreen />);
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  it('calls signIn and navigates on valid input', async () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/main');
    });
  });

  it('shows alert if fields are empty', () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText('Login'));
  });

  it('navigates to forgot password page when pressed', () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Forgot Password?'));
    expect(mockPush).toHaveBeenCalledWith('/forgetPW');
  });

  it('navigates to register page when Register is pressed', () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Register'));
    expect(mockReplace).toHaveBeenCalledWith('/register');
  });

});
