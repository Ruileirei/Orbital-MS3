import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import { getDocs } from 'firebase/firestore';
import React from 'react';
import FilterScreen from '../app/filter';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('@/src/Components/filterDropDown', () => {
  return (props: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    const { Button } = require('@rneui/themed');

    const { title, onToggleOption } = props;

    let buttons: React.ReactElement[] = [];

    if (title === 'By Cuisine') {
      buttons = [
        <Button key="Chinese" title="Chinese" onPress={() => onToggleOption('Chinese')} />,
        <Button key="Malay" title="Malay" onPress={() => onToggleOption('Malay')} />,
      ];
    } else if (title === 'Miscellaneous') {
      buttons = [
        <Button key="Hide Closed Stalls" title="Hide Closed Stalls" onPress={() => onToggleOption('Hide Closed Stalls')} />,
      ];
    } else if (title === 'Sort by Rating') {
      buttons = [
        <Button key="High to Low" title="High to Low" onPress={() => onToggleOption('High to Low')} />,
      ];
    }

    return (
      <View>
        <Text>{title}</Text>
        {buttons}
      </View>
    );
  };
});

describe('FilterScreen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    });

    (getDocs as jest.Mock).mockResolvedValue({
      forEach: (cb: any) => {
        cb({ data: () => ({ cuisine: 'Chinese' }) });
        cb({ data: () => ({ cuisine: 'Malay' }) });
      },
    });
  });

  it('renders main sections', async () => {
    render(<FilterScreen />);
    await waitFor(() => {
      expect(screen.getByText('Filter')).toBeTruthy();
      expect(screen.getByText('Sort by Rating')).toBeTruthy();
      expect(screen.getByText('By Cuisine')).toBeTruthy();
      expect(screen.getByText('Miscellaneous')).toBeTruthy();
    });
  });

  it('fetches cuisines from Firestore', async () => {
    render(<FilterScreen />);
    await waitFor(() => {
      expect(getDocs).toHaveBeenCalled();
    });
  });

  it('renders fetched cuisine options in dropdown', async () => {
    render(<FilterScreen />);
    await waitFor(() => {
      expect(screen.getByText('Chinese')).toBeTruthy();
      expect(screen.getByText('Malay')).toBeTruthy();
    });
  });

  it('toggles a cuisine selection', async () => {
    render(<FilterScreen />);
    const chineseButton = await screen.findByText('Chinese');
    fireEvent.press(chineseButton);
    await waitFor(() => {
      expect(screen.getByText('Apply (1)')).toBeTruthy();
    });
  });

  it('toggles Hide Closed Stalls option', async () => {
    render(<FilterScreen />);
    const miscButton = await screen.findByText('Hide Closed Stalls');
    fireEvent.press(miscButton);
    await waitFor(() => {
      expect(screen.getByText('Apply (1)')).toBeTruthy();
    });

    fireEvent.press(miscButton);
    await waitFor(() => {
      expect(screen.getByText('Apply (0)')).toBeTruthy();
    });
  });

  it('toggles Sort By option', async () => {
    render(<FilterScreen />);
    const sortButton = await screen.findByText('High to Low');
    fireEvent.press(sortButton);
    await waitFor(() => {
      expect(screen.getByText('Apply (1)')).toBeTruthy();
    });
  });

  it('resets selections on Clear', async () => {
    render(<FilterScreen />);

    const chineseButton = await screen.findByText('Chinese');
    fireEvent.press(chineseButton);
    const miscButton = await screen.findByText('Hide Closed Stalls');
    fireEvent.press(miscButton);
    const sortButton = await screen.findByText('High to Low');
    fireEvent.press(sortButton);

    await waitFor(() => {
      expect(screen.getByText('Apply (3)')).toBeTruthy();
    });

    const clearButton = screen.getByText('Clear');
    fireEvent.press(clearButton);
    await waitFor(() => {
      expect(screen.getByText('Apply (0)')).toBeTruthy();
    });
  });

  it('Apply button shows combined selection count', async () => {
    render(<FilterScreen />);
    const chineseButton = await screen.findByText('Chinese');
    fireEvent.press(chineseButton);
    const miscButton = await screen.findByText('Hide Closed Stalls');
    fireEvent.press(miscButton);

    await waitFor(() => {
      expect(screen.getByText('Apply (2)')).toBeTruthy();
    });
  });

  it('handles Clear button', async () => {
    render(<FilterScreen />);
    await waitFor(() => expect(getDocs).toHaveBeenCalled());

    const clearButton = screen.getByText('Clear');
    fireEvent.press(clearButton);

    await waitFor(() => {
      expect(screen.getByText('Apply (0)')).toBeTruthy();
    });
  });

  it('handles Apply button', async () => {
    render(<FilterScreen />);
    await waitFor(() => expect(getDocs).toHaveBeenCalled());

    const applyButton = screen.getByText(/Apply/i);
    fireEvent.press(applyButton);

    expect(mockPush).toHaveBeenCalled();
  });
});
