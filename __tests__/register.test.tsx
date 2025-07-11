import * as registerService from '@/services/firebaseRegisterService';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import Register from '../app/register';

// ✅ Mock the services
jest.mock('@/services/firebaseRegisterService', () => ({
  registerUser: jest.fn(),
  saveUserData: jest.fn(),
}));

// ✅ Mock the router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// ✅ Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('Register Screen', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      push: jest.fn(),
    });

    // Reset service mocks before each test
    (registerService.registerUser as jest.Mock).mockReset();
    (registerService.saveUserData as jest.Mock).mockReset();
    (Alert.alert as jest.Mock).mockClear();
  });

  it('renders all input fields', () => {
    render(<Register />);
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  it('calls registerUser and saveUserData on valid input', async () => {
    (registerService.registerUser as jest.Mock).mockResolvedValue({ user: { uid: '123' } });
    (registerService.saveUserData as jest.Mock).mockResolvedValue(undefined);

    render(<Register />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'TestUser');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getByText('Register'));

    await waitFor(() => {
      expect(registerService.registerUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(registerService.saveUserData).toHaveBeenCalledWith('123', expect.any(Object));
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('shows alert if fields are empty', () => {
    render(<Register />);
    fireEvent.press(screen.getByText('Register'));

    expect(Alert.alert).toHaveBeenCalledWith('Please fill in all fields');
  });

  it('shows success alert on successful register', async () => {
    (registerService.registerUser as jest.Mock).mockResolvedValue({ user: { uid: '123' } });
    (registerService.saveUserData as jest.Mock).mockResolvedValue(undefined);

    render(<Register />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'TestUser');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getByText('Register'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Registered successfully! Please Login.');
    });
  });
});

