import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes, faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from '../src/lib/hooks';

// Address Card Component
function AddressCard({
  address,
  isDefault,
  onSetDefault,
  onEdit,
  onDelete,
}: {
  address: any;
  isDefault: boolean;
  onSetDefault: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={[styles.addressCard, isDefault && styles.defaultCard]}>
      {isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}
      <Text style={styles.addressName}>{address.name}</Text>
      {address.email && <Text style={styles.addressLine}>✉️ {address.email}</Text>}
      <Text style={styles.addressLine}>{address.street}</Text>
      <Text style={styles.addressLine}>
        {address.city}, {address.state} {address.zip}
      </Text>
      <Text style={styles.addressLine}>{address.country}</Text>
      {address.mobile && <Text style={styles.addressPhone}>📞 {address.mobile}</Text>}
      <View style={styles.addressActions}>
        {!isDefault && (
          <TouchableOpacity style={styles.addressAction} onPress={onSetDefault}>
            <Text style={styles.actionText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.addressAction} onPress={onEdit}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addressAction} onPress={onDelete}>
          <Text style={[styles.actionText, styles.deleteAction]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Add/Edit Address Modal
function AddressModal({
  visible,
  onClose,
  onSave,
  initialData,
  isLoading,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    mobile: initialData?.mobile || '',
    street: initialData?.street || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zip: initialData?.zip || '',
    country: initialData?.country || 'India',
    isDefault: initialData?.isDefault || false,
  });

  // Reset form when initialData changes (opening modal for edit or add)
  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      email: initialData?.email || '',
      mobile: initialData?.mobile || '',
      street: initialData?.street || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zip: initialData?.zip || '',
      country: initialData?.country || 'India',
      isDefault: initialData?.isDefault || false,
    });
  }, [initialData]);

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.mobile ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.zip
    ) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialData ? 'Edit Address' : 'Add New Address'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile *</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 1234567890"
                value={formData.mobile}
                onChangeText={(text) => setFormData({ ...formData, mobile: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Main Street"
                value={formData.street}
                onChangeText={(text) => setFormData({ ...formData, street: text })}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New York"
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>State *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="NY"
                  value={formData.state}
                  onChangeText={(text) => setFormData({ ...formData, state: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>ZIP Code *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10001"
                  value={formData.zip}
                  onChangeText={(text) => setFormData({ ...formData, zip: text })}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Country *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="United States"
                  value={formData.country}
                  onChangeText={(text) => setFormData({ ...formData, country: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.defaultToggle}
              onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
            >
              <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
                {formData.isDefault && <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.defaultToggleText}>Set as default address</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>{initialData ? 'Update' : 'Save'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Main Addresses Screen
export default function AddressesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const { data: addresses = [], isLoading, refetch } = useAddresses();
  const { addAddress, isLoading: isAdding } = useAddAddress();
  const { updateAddress, isLoading: isUpdating } = useUpdateAddress();
  const { deleteAddress, isLoading: isDeleting } = useDeleteAddress();
  const { setDefaultAddress, isLoading: isSettingDefault } = useSetDefaultAddress();

  const handleSaveAddress = async (data: any) => {
    try {
      if (editingAddress) {
        // Update existing address
        await updateAddress({ id: editingAddress.id, input: data });
        Alert.alert('Success', 'Address updated successfully');
      } else {
        // Add new address
        await addAddress(data);
        Alert.alert('Success', 'Address added successfully');
      }
      setModalVisible(false);
      setEditingAddress(null);
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save address');
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setModalVisible(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAddress(addressId);
            Alert.alert('Success', 'Address deleted successfully');
            refetch();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete address');
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      Alert.alert('Success', 'Default address updated');
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to set default address');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faArrowLeft} size={16} color="#4F46E5" />
          <Text style={[styles.backButton, { marginLeft: 4 }]}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity
          onPress={() => {
            setEditingAddress(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButton}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading addresses...</Text>
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📍</Text>
          <Text style={styles.emptyTitle}>No addresses saved</Text>
          <Text style={styles.emptyText}>Add an address for faster checkout</Text>
          <TouchableOpacity style={styles.addAddressButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addAddressButtonText}>Add Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AddressCard
              address={item}
              isDefault={item.isDefault}
              onSetDefault={() => handleSetDefault(item.id)}
              onEdit={() => handleEditAddress(item)}
              onDelete={() => handleDeleteAddress(item.id)}
            />
          )}
          contentContainerStyle={styles.addressList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add/Edit Modal */}
      <AddressModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        initialData={editingAddress}
        isLoading={isAdding || isUpdating}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  addressList: {
    padding: 16,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  defaultCard: {
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  defaultBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  addressLine: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  addressPhone: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
  },
  addressActions: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 16,
  },
  addressAction: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  deleteAction: {
    color: '#EF4444',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  addAddressButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  addAddressButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    fontSize: 20,
    color: '#6B7280',
    padding: 4,
  },
  modalScroll: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
  },
  defaultToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  defaultToggleText: {
    fontSize: 14,
    color: '#374151',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
