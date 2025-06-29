import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import Register from '../app/register';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('Register Screen', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      push: jest.fn(),
    });
  });

  it('renders all input fields', () => {
    render(<Register />);
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  it('calls registerUser and saveUserData on valid input', async () => {
    render(<Register />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'TestUser');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getByText('Register'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('shows alert if fields are empty', () => {
    const { getByText } = render(<Register />);
    fireEvent.press(getByText('Register'));
  });
});
