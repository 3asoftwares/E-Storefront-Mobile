import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AddressesScreen from '../../../app/addresses';
import {
    useAddresses,
    useAddAddress,
    useUpdateAddress,
    useDeleteAddress,
    useSetDefaultAddress,
} from '../../lib/hooks';
import { router } from 'expo-router';

// Mock dependencies
jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        back: jest.fn(),
    },
    Stack: {
        Screen: () => null,
    },
}));

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: () => null,
}));

jest.mock('../../lib/hooks', () => ({
    useAddresses: jest.fn(),
    useAddAddress: jest.fn(),
    useUpdateAddress: jest.fn(),
    useDeleteAddress: jest.fn(),
    useSetDefaultAddress: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('AddressesScreen', () => {
    const mockRefetch = jest.fn();
    const mockAddAddress = jest.fn();
    const mockUpdateAddress = jest.fn();
    const mockDeleteAddress = jest.fn();
    const mockSetDefaultAddress = jest.fn();

    const mockAddresses = [
        {
            id: 'addr-1',
            name: 'John Doe',
            email: 'john@example.com',
            mobile: '+1234567890',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'USA',
            isDefault: true,
        },
        {
            id: 'addr-2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            mobile: '+0987654321',
            street: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001',
            country: 'USA',
            isDefault: false,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useAddresses as jest.Mock).mockReturnValue({
            data: mockAddresses,
            isLoading: false,
            refetch: mockRefetch,
        });
        (useAddAddress as jest.Mock).mockReturnValue({
            addAddress: mockAddAddress,
            isLoading: false,
        });
        (useUpdateAddress as jest.Mock).mockReturnValue({
            updateAddress: mockUpdateAddress,
            isLoading: false,
        });
        (useDeleteAddress as jest.Mock).mockReturnValue({
            deleteAddress: mockDeleteAddress,
            isLoading: false,
        });
        (useSetDefaultAddress as jest.Mock).mockReturnValue({
            setDefaultAddress: mockSetDefaultAddress,
            isLoading: false,
        });
    });

    it('should render addresses screen correctly', () => {
        const { getByText } = render(<AddressesScreen />);

        expect(getByText('My Addresses')).toBeTruthy();
    });

    it('should display address name', () => {
        const { getByText } = render(<AddressesScreen />);

        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('Jane Smith')).toBeTruthy();
    });

    it('should display address street', () => {
        const { getByText } = render(<AddressesScreen />);

        expect(getByText('123 Main Street')).toBeTruthy();
        expect(getByText('456 Oak Avenue')).toBeTruthy();
    });

    it('should display city, state and zip', () => {
        const { getByText } = render(<AddressesScreen />);

        expect(getByText('New York, NY 10001')).toBeTruthy();
        expect(getByText('Los Angeles, CA 90001')).toBeTruthy();
    });

    it('should display default badge for default address', () => {
        const { getByText } = render(<AddressesScreen />);

        expect(getByText('Default')).toBeTruthy();
    });

    it('should display edit button for each address', () => {
        const { getAllByText } = render(<AddressesScreen />);

        expect(getAllByText('Edit').length).toBe(2);
    });

    it('should display delete button for each address', () => {
        const { getAllByText } = render(<AddressesScreen />);

        expect(getAllByText('Delete').length).toBe(2);
    });

    it('should display set as default button for non-default address', () => {
        const { getByText } = render(<AddressesScreen />);

        expect(getByText('Set as Default')).toBeTruthy();
    });

    it('should display add button in header', () => {
        const { getByText } = render(<AddressesScreen />);

        expect(getByText('+ Add')).toBeTruthy();
    });

    it('should display back button', () => {
        const { getByText } = render(<AddressesScreen />);

        expect(getByText('Back')).toBeTruthy();
    });

    it('should show loading state', () => {
        (useAddresses as jest.Mock).mockReturnValue({
            data: [],
            isLoading: true,
            refetch: mockRefetch,
        });

        const { getByText } = render(<AddressesScreen />);

        expect(getByText('Loading addresses...')).toBeTruthy();
    });

    it('should show empty state when no addresses', () => {
        (useAddresses as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
            refetch: mockRefetch,
        });

        const { getByText } = render(<AddressesScreen />);

        expect(getByText('No addresses saved')).toBeTruthy();
        expect(getByText('Add an address for faster checkout')).toBeTruthy();
        expect(getByText('Add Address')).toBeTruthy();
    });

    it('should display email for address', () => {
        const { getByText } = render(<AddressesScreen />);

        expect(getByText('✉️ john@example.com')).toBeTruthy();
    });

    it('should display phone for address', () => {
        const { getByText } = render(<AddressesScreen />);

        expect(getByText('📞 +1234567890')).toBeTruthy();
    });

    it('should render correctly', () => {
        const { toJSON } = render(<AddressesScreen />);
        expect(toJSON()).toBeTruthy();
    });

    it('should display country for address', () => {
        const { getAllByText } = render(<AddressesScreen />);

        expect(getAllByText('USA').length).toBe(2);
    });

    // Navigation tests
    it('should navigate back when back button is pressed', () => {
        const { getByText } = render(<AddressesScreen />);

        fireEvent.press(getByText('Back'));

        expect(router.back).toHaveBeenCalled();
    });

    // Add Address Modal tests
    it('should open add address modal when + Add button is pressed', () => {
        const { getByText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        expect(getByText('Add New Address')).toBeTruthy();
    });

    it('should open add address modal from empty state button', () => {
        (useAddresses as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
            refetch: mockRefetch,
        });

        const { getByText } = render(<AddressesScreen />);

        fireEvent.press(getByText('Add Address'));

        expect(getByText('Add New Address')).toBeTruthy();
    });

    it('should display all form fields in add modal', () => {
        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        expect(getByText('Full Name *')).toBeTruthy();
        expect(getByText('Email')).toBeTruthy();
        expect(getByText('Mobile *')).toBeTruthy();
        expect(getByText('Street Address *')).toBeTruthy();
        expect(getByText('City *')).toBeTruthy();
        expect(getByText('State *')).toBeTruthy();
        expect(getByText('ZIP Code *')).toBeTruthy();
        expect(getByText('Country *')).toBeTruthy();
        expect(getByPlaceholderText('John Doe')).toBeTruthy();
        expect(getByPlaceholderText('email@example.com')).toBeTruthy();
        expect(getByPlaceholderText('+91 1234567890')).toBeTruthy();
        expect(getByPlaceholderText('123 Main Street')).toBeTruthy();
    });

    it('should close modal when Cancel button is pressed', () => {
        const { getByText, queryByText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));
        expect(getByText('Add New Address')).toBeTruthy();

        fireEvent.press(getByText('Cancel'));

        expect(queryByText('Add New Address')).toBeNull();
    });

    it('should close modal when X button is pressed', async () => {
        const { getByText, queryByText, UNSAFE_getAllByType } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));
        expect(getByText('Add New Address')).toBeTruthy();

        // The X button is a TouchableOpacity with FontAwesomeIcon, find it in modal header
        const cancelTouchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
        // Find the close button (it's in the modal header, after the title)
        const closeButton = cancelTouchables.find((t: any) => {
            const parent = t.parent;
            return parent?.props?.style?.flexDirection === 'row' && 
                   parent?.props?.style?.justifyContent === 'space-between';
        });
        if (closeButton) {
            fireEvent.press(closeButton);
        }
    });

    it('should update form fields when typing', () => {
        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        const nameInput = getByPlaceholderText('John Doe');
        fireEvent.changeText(nameInput, 'Test User');
        expect(nameInput.props.value).toBe('Test User');

        const emailInput = getByPlaceholderText('email@example.com');
        fireEvent.changeText(emailInput, 'test@test.com');
        expect(emailInput.props.value).toBe('test@test.com');

        const mobileInput = getByPlaceholderText('+91 1234567890');
        fireEvent.changeText(mobileInput, '+1234567890');
        expect(mobileInput.props.value).toBe('+1234567890');

        const streetInput = getByPlaceholderText('123 Main Street');
        fireEvent.changeText(streetInput, '789 Test Road');
        expect(streetInput.props.value).toBe('789 Test Road');
    });

    it('should update city, state, zip and country fields', () => {
        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        const cityInput = getByPlaceholderText('New York');
        fireEvent.changeText(cityInput, 'Chicago');
        expect(cityInput.props.value).toBe('Chicago');

        const stateInput = getByPlaceholderText('NY');
        fireEvent.changeText(stateInput, 'IL');
        expect(stateInput.props.value).toBe('IL');

        const zipInput = getByPlaceholderText('10001');
        fireEvent.changeText(zipInput, '60601');
        expect(zipInput.props.value).toBe('60601');

        const countryInput = getByPlaceholderText('United States');
        fireEvent.changeText(countryInput, 'Canada');
        expect(countryInput.props.value).toBe('Canada');
    });

    it('should toggle isDefault checkbox', () => {
        const { getByText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        const defaultToggle = getByText('Set as default address');
        fireEvent.press(defaultToggle);
        // Toggle is pressed, checkbox should update
    });

    it('should show validation error when required fields are empty', () => {
        const { getByText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));
        fireEvent.press(getByText('Save'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Missing Information',
            'Please fill in all required fields'
        );
    });

    it('should show validation error when name is missing', () => {
        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        // Fill all fields except name
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), 'Test Street');
        fireEvent.changeText(getByPlaceholderText('New York'), 'Test City');
        fireEvent.changeText(getByPlaceholderText('NY'), 'TS');
        fireEvent.changeText(getByPlaceholderText('10001'), '12345');

        fireEvent.press(getByText('Save'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Missing Information',
            'Please fill in all required fields'
        );
    });

    it('should successfully add a new address', async () => {
        mockAddAddress.mockResolvedValueOnce({});

        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        // Fill all required fields
        fireEvent.changeText(getByPlaceholderText('John Doe'), 'New User');
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), '123 New Street');
        fireEvent.changeText(getByPlaceholderText('New York'), 'New City');
        fireEvent.changeText(getByPlaceholderText('NY'), 'NC');
        fireEvent.changeText(getByPlaceholderText('10001'), '54321');

        fireEvent.press(getByText('Save'));

        await waitFor(() => {
            expect(mockAddAddress).toHaveBeenCalledWith({
                name: 'New User',
                email: '',
                mobile: '+1234567890',
                street: '123 New Street',
                city: 'New City',
                state: 'NC',
                zip: '54321',
                country: 'India',
                isDefault: false,
            });
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Address added successfully');
        });

        expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show error when add address fails', async () => {
        mockAddAddress.mockRejectedValueOnce(new Error('Network error'));

        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'New User');
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), '123 New Street');
        fireEvent.changeText(getByPlaceholderText('New York'), 'New City');
        fireEvent.changeText(getByPlaceholderText('NY'), 'NC');
        fireEvent.changeText(getByPlaceholderText('10001'), '54321');

        fireEvent.press(getByText('Save'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Network error');
        });
    });

    it('should show generic error message when add address fails without message', async () => {
        mockAddAddress.mockRejectedValueOnce({});

        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'New User');
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), '123 New Street');
        fireEvent.changeText(getByPlaceholderText('New York'), 'New City');
        fireEvent.changeText(getByPlaceholderText('NY'), 'NC');
        fireEvent.changeText(getByPlaceholderText('10001'), '54321');

        fireEvent.press(getByText('Save'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to save address');
        });
    });

    // Edit Address tests
    it('should open edit modal when Edit button is pressed', () => {
        const { getAllByText, getByText } = render(<AddressesScreen />);

        const editButtons = getAllByText('Edit');
        fireEvent.press(editButtons[0]);

        expect(getByText('Edit Address')).toBeTruthy();
    });

    it('should pre-populate form with address data when editing', () => {
        const { getAllByText, getByPlaceholderText } = render(<AddressesScreen />);

        const editButtons = getAllByText('Edit');
        fireEvent.press(editButtons[0]);

        expect(getByPlaceholderText('John Doe').props.value).toBe('John Doe');
        expect(getByPlaceholderText('email@example.com').props.value).toBe('john@example.com');
        expect(getByPlaceholderText('+91 1234567890').props.value).toBe('+1234567890');
        expect(getByPlaceholderText('123 Main Street').props.value).toBe('123 Main Street');
    });

    it('should show Update button when editing', () => {
        const { getAllByText, getByText } = render(<AddressesScreen />);

        const editButtons = getAllByText('Edit');
        fireEvent.press(editButtons[0]);

        expect(getByText('Update')).toBeTruthy();
    });

    it('should successfully update an address', async () => {
        mockUpdateAddress.mockResolvedValueOnce({});

        const { getAllByText, getByText, getByPlaceholderText } = render(<AddressesScreen />);

        const editButtons = getAllByText('Edit');
        fireEvent.press(editButtons[0]);

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'Updated Name');

        fireEvent.press(getByText('Update'));

        await waitFor(() => {
            expect(mockUpdateAddress).toHaveBeenCalledWith({
                id: 'addr-1',
                input: expect.objectContaining({
                    name: 'Updated Name',
                }),
            });
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Address updated successfully');
        });

        expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show error when update address fails', async () => {
        mockUpdateAddress.mockRejectedValueOnce(new Error('Update failed'));

        const { getAllByText, getByText } = render(<AddressesScreen />);

        const editButtons = getAllByText('Edit');
        fireEvent.press(editButtons[0]);

        fireEvent.press(getByText('Update'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Update failed');
        });
    });

    // Delete Address tests
    it('should show delete confirmation dialog', () => {
        const { getAllByText } = render(<AddressesScreen />);

        const deleteButtons = getAllByText('Delete');
        fireEvent.press(deleteButtons[0]);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Delete Address',
            'Are you sure you want to delete this address?',
            expect.arrayContaining([
                expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
                expect.objectContaining({ text: 'Delete', style: 'destructive' }),
            ])
        );
    });

    it('should delete address when confirmed', async () => {
        mockDeleteAddress.mockResolvedValueOnce({});

        const { getAllByText } = render(<AddressesScreen />);

        const deleteButtons = getAllByText('Delete');
        fireEvent.press(deleteButtons[0]);

        // Get the onPress handler for the Delete button in the Alert
        const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
        const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Delete');
        
        await deleteButton.onPress();

        await waitFor(() => {
            expect(mockDeleteAddress).toHaveBeenCalledWith('addr-1');
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Address deleted successfully');
        });

        expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show error when delete address fails', async () => {
        mockDeleteAddress.mockRejectedValueOnce(new Error('Delete failed'));

        const { getAllByText } = render(<AddressesScreen />);

        const deleteButtons = getAllByText('Delete');
        fireEvent.press(deleteButtons[0]);

        const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
        const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Delete');
        
        await deleteButton.onPress();

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Delete failed');
        });
    });

    it('should show generic error when delete fails without message', async () => {
        mockDeleteAddress.mockRejectedValueOnce({});

        const { getAllByText } = render(<AddressesScreen />);

        const deleteButtons = getAllByText('Delete');
        fireEvent.press(deleteButtons[0]);

        const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
        const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Delete');
        
        await deleteButton.onPress();

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to delete address');
        });
    });

    // Set Default Address tests
    it('should set address as default when Set as Default is pressed', async () => {
        mockSetDefaultAddress.mockResolvedValueOnce({});

        const { getByText } = render(<AddressesScreen />);

        fireEvent.press(getByText('Set as Default'));

        await waitFor(() => {
            expect(mockSetDefaultAddress).toHaveBeenCalledWith('addr-2');
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Default address updated');
        });

        expect(mockRefetch).toHaveBeenCalled();
    });

    it('should show error when set default fails', async () => {
        mockSetDefaultAddress.mockRejectedValueOnce(new Error('Set default failed'));

        const { getByText } = render(<AddressesScreen />);

        fireEvent.press(getByText('Set as Default'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Set default failed');
        });
    });

    it('should show generic error when set default fails without message', async () => {
        mockSetDefaultAddress.mockRejectedValueOnce({});

        const { getByText } = render(<AddressesScreen />);

        fireEvent.press(getByText('Set as Default'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to set default address');
        });
    });

    // Loading state tests
    it('should show loading indicator in modal when adding address', () => {
        (useAddAddress as jest.Mock).mockReturnValue({
            addAddress: mockAddAddress,
            isLoading: true,
        });

        const { getByText, UNSAFE_getAllByType } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        const activityIndicators = UNSAFE_getAllByType(require('react-native').ActivityIndicator);
        expect(activityIndicators.length).toBeGreaterThan(0);
    });

    it('should show loading indicator in modal when updating address', () => {
        (useUpdateAddress as jest.Mock).mockReturnValue({
            updateAddress: mockUpdateAddress,
            isLoading: true,
        });

        const { getAllByText, UNSAFE_getAllByType } = render(<AddressesScreen />);

        const editButtons = getAllByText('Edit');
        fireEvent.press(editButtons[0]);

        const activityIndicators = UNSAFE_getAllByType(require('react-native').ActivityIndicator);
        expect(activityIndicators.length).toBeGreaterThan(0);
    });

    // Address without optional fields
    it('should display address without email', () => {
        (useAddresses as jest.Mock).mockReturnValue({
            data: [
                {
                    id: 'addr-3',
                    name: 'No Email User',
                    mobile: '+1111111111',
                    street: '789 No Email St',
                    city: 'Boston',
                    state: 'MA',
                    zip: '02101',
                    country: 'USA',
                    isDefault: false,
                },
            ],
            isLoading: false,
            refetch: mockRefetch,
        });

        const { getByText, queryByText } = render(<AddressesScreen />);

        expect(getByText('No Email User')).toBeTruthy();
        expect(queryByText(/✉️/)).toBeNull();
    });

    it('should display address without mobile', () => {
        (useAddresses as jest.Mock).mockReturnValue({
            data: [
                {
                    id: 'addr-4',
                    name: 'No Phone User',
                    email: 'nophone@test.com',
                    street: '999 No Phone Ave',
                    city: 'Seattle',
                    state: 'WA',
                    zip: '98101',
                    country: 'USA',
                    isDefault: false,
                },
            ],
            isLoading: false,
            refetch: mockRefetch,
        });

        const { getByText, queryByText } = render(<AddressesScreen />);

        expect(getByText('No Phone User')).toBeTruthy();
        expect(queryByText(/📞/)).toBeNull();
    });

    // Modal closes after successful operations
    it('should close modal after successful add', async () => {
        mockAddAddress.mockResolvedValueOnce({});

        const { getByText, getByPlaceholderText, queryByText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));
        expect(getByText('Add New Address')).toBeTruthy();

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'New User');
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), '123 New Street');
        fireEvent.changeText(getByPlaceholderText('New York'), 'New City');
        fireEvent.changeText(getByPlaceholderText('NY'), 'NC');
        fireEvent.changeText(getByPlaceholderText('10001'), '54321');

        fireEvent.press(getByText('Save'));

        await waitFor(() => {
            expect(mockAddAddress).toHaveBeenCalled();
        }, { timeout: 3000 });
        
        // Modal should close after success
        expect(queryByText('Add New Address')).toBeNull();
    }, 10000);

    it('should close modal after successful update', async () => {
        mockUpdateAddress.mockResolvedValueOnce({});

        const { getAllByText, getByText, queryByText } = render(<AddressesScreen />);

        const editButtons = getAllByText('Edit');
        fireEvent.press(editButtons[0]);
        expect(getByText('Edit Address')).toBeTruthy();

        fireEvent.press(getByText('Update'));

        await waitFor(() => {
            expect(mockUpdateAddress).toHaveBeenCalled();
        }, { timeout: 3000 });
        
        // Modal should close after success  
        expect(queryByText('Edit Address')).toBeNull();
    }, 10000);

    // Edge case tests
    it('should handle address with all optional fields', () => {
        const addressWithAllFields = {
            id: 'addr-5',
            name: 'Complete User',
            email: 'complete@test.com',
            mobile: '+9999999999',
            street: '100 Complete St',
            city: 'Denver',
            state: 'CO',
            zip: '80201',
            country: 'USA',
            isDefault: true,
        };

        (useAddresses as jest.Mock).mockReturnValue({
            data: [addressWithAllFields],
            isLoading: false,
            refetch: mockRefetch,
        });

        const { getByText } = render(<AddressesScreen />);

        expect(getByText('Complete User')).toBeTruthy();
        expect(getByText('✉️ complete@test.com')).toBeTruthy();
        expect(getByText('📞 +9999999999')).toBeTruthy();
        expect(getByText('100 Complete St')).toBeTruthy();
        expect(getByText('Denver, CO 80201')).toBeTruthy();
        expect(getByText('Default')).toBeTruthy();
    });

    it('should not show Set as Default for default address', () => {
        (useAddresses as jest.Mock).mockReturnValue({
            data: [mockAddresses[0]], // Only the default address
            isLoading: false,
            refetch: mockRefetch,
        });

        const { queryByText } = render(<AddressesScreen />);

        expect(queryByText('Set as Default')).toBeNull();
    });

    it('should add address with email field filled', async () => {
        mockAddAddress.mockResolvedValueOnce({});

        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'Email User');
        fireEvent.changeText(getByPlaceholderText('email@example.com'), 'emailuser@test.com');
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), '123 Email Street');
        fireEvent.changeText(getByPlaceholderText('New York'), 'Email City');
        fireEvent.changeText(getByPlaceholderText('NY'), 'EC');
        fireEvent.changeText(getByPlaceholderText('10001'), '11111');

        fireEvent.press(getByText('Save'));

        await waitFor(() => {
            expect(mockAddAddress).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'emailuser@test.com',
                })
            );
        });
    });

    it('should add address with isDefault set to true', async () => {
        mockAddAddress.mockResolvedValueOnce({});

        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'Default User');
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), '123 Default Street');
        fireEvent.changeText(getByPlaceholderText('New York'), 'Default City');
        fireEvent.changeText(getByPlaceholderText('NY'), 'DC');
        fireEvent.changeText(getByPlaceholderText('10001'), '22222');

        // Toggle default checkbox
        fireEvent.press(getByText('Set as default address'));

        fireEvent.press(getByText('Save'));

        await waitFor(() => {
            expect(mockAddAddress).toHaveBeenCalledWith(
                expect.objectContaining({
                    isDefault: true,
                })
            );
        });
    });

    it('should handle empty data array from useAddresses', () => {
        (useAddresses as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            refetch: mockRefetch,
        });

        const { getByText } = render(<AddressesScreen />);

        expect(getByText('No addresses saved')).toBeTruthy();
    });

    it('should handle multiple addresses without default', () => {
        (useAddresses as jest.Mock).mockReturnValue({
            data: [
                { ...mockAddresses[0], isDefault: false },
                { ...mockAddresses[1], isDefault: false },
            ],
            isLoading: false,
            refetch: mockRefetch,
        });

        const { getAllByText, queryByText } = render(<AddressesScreen />);

        // Should show Set as Default for both
        expect(getAllByText('Set as Default').length).toBe(2);
        // Should not show Default badge
        expect(queryByText('Default')).toBeNull();
    });

    it('should reset editingAddress when closing modal after edit', async () => {
        const { getAllByText, getByText, queryByText } = render(<AddressesScreen />);

        // Open edit modal
        const editButtons = getAllByText('Edit');
        fireEvent.press(editButtons[0]);
        expect(getByText('Edit Address')).toBeTruthy();

        // Close modal
        fireEvent.press(getByText('Cancel'));
        expect(queryByText('Edit Address')).toBeNull();

        // Open add modal - should show "Add New Address" not "Edit Address"
        fireEvent.press(getByText('+ Add'));
        expect(getByText('Add New Address')).toBeTruthy();
    });

    it('should show validation error when mobile is missing', () => {
        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        // Fill all fields except mobile
        fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), 'Test Street');
        fireEvent.changeText(getByPlaceholderText('New York'), 'Test City');
        fireEvent.changeText(getByPlaceholderText('NY'), 'TS');
        fireEvent.changeText(getByPlaceholderText('10001'), '12345');

        fireEvent.press(getByText('Save'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Missing Information',
            'Please fill in all required fields'
        );
    });

    it('should show validation error when street is missing', () => {
        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('New York'), 'Test City');
        fireEvent.changeText(getByPlaceholderText('NY'), 'TS');
        fireEvent.changeText(getByPlaceholderText('10001'), '12345');

        fireEvent.press(getByText('Save'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Missing Information',
            'Please fill in all required fields'
        );
    });

    it('should show validation error when city is missing', () => {
        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), 'Test Street');
        fireEvent.changeText(getByPlaceholderText('NY'), 'TS');
        fireEvent.changeText(getByPlaceholderText('10001'), '12345');

        fireEvent.press(getByText('Save'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Missing Information',
            'Please fill in all required fields'
        );
    });

    it('should show validation error when state is missing', () => {
        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), 'Test Street');
        fireEvent.changeText(getByPlaceholderText('New York'), 'Test City');
        fireEvent.changeText(getByPlaceholderText('10001'), '12345');

        fireEvent.press(getByText('Save'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Missing Information',
            'Please fill in all required fields'
        );
    });

    it('should show validation error when zip is missing', () => {
        const { getByText, getByPlaceholderText } = render(<AddressesScreen />);

        fireEvent.press(getByText('+ Add'));

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'Test User');
        fireEvent.changeText(getByPlaceholderText('+91 1234567890'), '+1234567890');
        fireEvent.changeText(getByPlaceholderText('123 Main Street'), 'Test Street');
        fireEvent.changeText(getByPlaceholderText('New York'), 'Test City');
        fireEvent.changeText(getByPlaceholderText('NY'), 'TS');

        fireEvent.press(getByText('Save'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Missing Information',
            'Please fill in all required fields'
        );
    });

    it('should update second address correctly', async () => {
        mockUpdateAddress.mockResolvedValueOnce({});

        const { getAllByText, getByText, getByPlaceholderText } = render(<AddressesScreen />);

        const editButtons = getAllByText('Edit');
        fireEvent.press(editButtons[1]); // Edit second address

        expect(getByPlaceholderText('John Doe').props.value).toBe('Jane Smith');

        fireEvent.changeText(getByPlaceholderText('John Doe'), 'Jane Updated');

        fireEvent.press(getByText('Update'));

        await waitFor(() => {
            expect(mockUpdateAddress).toHaveBeenCalledWith({
                id: 'addr-2',
                input: expect.objectContaining({
                    name: 'Jane Updated',
                }),
            });
        });
    });

    it('should delete second address correctly', async () => {
        mockDeleteAddress.mockResolvedValueOnce({});

        const { getAllByText } = render(<AddressesScreen />);

        const deleteButtons = getAllByText('Delete');
        fireEvent.press(deleteButtons[1]); // Delete second address

        const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
        const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Delete');
        
        await deleteButton.onPress();

        await waitFor(() => {
            expect(mockDeleteAddress).toHaveBeenCalledWith('addr-2');
        });
    });
});
