import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import LoginScreen from '../app/index';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockReplace = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockReplace.mockClear();
    mockPush.mockClear();

    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      push: mockPush,
    });

    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
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
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Login'));

    expect(Alert.alert).toHaveBeenCalledWith('Please enter your email and password');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('shows alert if password is missing', () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.press(screen.getByText('Login'));

    expect(Alert.alert).toHaveBeenCalledWith('Please enter your email and password');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('shows alert if email is missing', () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getByText('Login'));

    expect(Alert.alert).toHaveBeenCalledWith('Please enter your email and password');
    expect(mockReplace).not.toHaveBeenCalled();
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
