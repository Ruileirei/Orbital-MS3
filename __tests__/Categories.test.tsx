import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import CategoryList from '../src/Components/CategoryList';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('CategoryList', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });
  });

  it('renders all categories', () => {
    render(<CategoryList />);
    expect(screen.getByText('Halal')).toBeTruthy();
    expect(screen.getByText('Barbeque')).toBeTruthy();
    expect(screen.getByText('Chicken Rice')).toBeTruthy();
    expect(screen.getByText('Noodles')).toBeTruthy();
    expect(screen.getByText("Editor's Picks")).toBeTruthy();
    expect(screen.getByText('Vegetarian')).toBeTruthy();
  });

  it('handles category press', () => {
    render(<CategoryList />);
    fireEvent.press(screen.getByText('Halal'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "./group/[id]",
      params: { id: 'halal' },
    });
  });
});
