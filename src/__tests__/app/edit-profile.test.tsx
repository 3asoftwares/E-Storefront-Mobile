import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditProfileScreen from '../../../app/edit-profile';
import { useCartStore } from '../../store/cartStore';
import { useUpdateProfile, useCurrentUser } from '../../lib/hooks';
import { router } from 'expo-router';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock('../../store/cartStore');
jest.mock('../../lib/hooks', () => ({
  useUpdateProfile: jest.fn(),
  useCurrentUser: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('EditProfileScreen', () => {
  const mockUpdateProfile = jest.fn();
  const mockStoreState = {
    userProfile: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useCartStore to handle selector functions
    (useCartStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStoreState);
      }
      return mockStoreState;
    });

    (useCurrentUser as jest.Mock).mockReturnValue({
      data: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
      },
      isLoading: false,
    });

    (useUpdateProfile as jest.Mock).mockReturnValue({
      updateProfile: mockUpdateProfile,
      isLoading: false,
      error: null,
    });
  });

  it('should render edit profile screen', () => {
    const { getByText } = render(<EditProfileScreen />);

    expect(getByText('Edit Profile')).toBeTruthy();
  });

  it('should pre-fill form with existing profile data', () => {
    const { getByDisplayValue } = render(<EditProfileScreen />);

    expect(getByDisplayValue('John Doe')).toBeTruthy();
    expect(getByDisplayValue('1234567890')).toBeTruthy();
  });

  it('should handle name input change', () => {
    const { getByDisplayValue } = render(<EditProfileScreen />);
    const nameInput = getByDisplayValue('John Doe');

    fireEvent.changeText(nameInput, 'Jane Smith');
    expect(nameInput.props.value).toBe('Jane Smith');
  });

  it('should handle phone input change', () => {
    const { getByDisplayValue } = render(<EditProfileScreen />);
    const phoneInput = getByDisplayValue('1234567890');

    fireEvent.changeText(phoneInput, '9876543210');
    expect(phoneInput.props.value).toBe('9876543210');
  });

  it('should save profile when save button is pressed', async () => {
    mockUpdateProfile.mockResolvedValue({ success: true });

    const { getByDisplayValue, getByText } = render(<EditProfileScreen />);
    const nameInput = getByDisplayValue('John Doe');

    fireEvent.changeText(nameInput, 'Jane Smith');

    const saveButton = getByText('Save Changes');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });

  it('should render correctly', () => {
    const { toJSON } = render(<EditProfileScreen />);
    expect(toJSON()).toBeTruthy();
  });
});
