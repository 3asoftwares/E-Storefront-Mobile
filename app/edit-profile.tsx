import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faUser,
  faEnvelope,
  faPhone,
  faSave,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useCartStore } from '../src/store/cartStore';
import { useUpdateProfile, useCurrentUser } from '../src/lib/hooks';
import { Colors } from '../src/constants/theme';

export default function EditProfileScreen() {
  const userProfile = useCartStore((state) => state.userProfile);
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { updateProfile, isLoading: updating, error } = useUpdateProfile();

  const user = currentUser || userProfile;

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const nameChanged = name !== (user?.name || '');
    const phoneChanged = phone !== (user?.phone || '');
    setHasChanges(nameChanged || phoneChanged);
  }, [name, phone, user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() || undefined });
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    }
  };

  if (userLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!hasChanges || updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <FontAwesomeIcon icon={faCheck} size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={styles.avatarHint}>Tap to change photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <FontAwesomeIcon icon={faUser} size={18} color={Colors.light.textTertiary} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.light.textTertiary}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputContainer, styles.inputDisabled]}>
                <FontAwesomeIcon icon={faEnvelope} size={18} color={Colors.light.textTertiary} />
                <TextInput
                  style={[styles.input, styles.inputTextDisabled]}
                  value={user?.email || ''}
                  editable={false}
                  placeholder="Email"
                  placeholderTextColor={Colors.light.textTertiary}
                />
              </View>
              <Text style={styles.inputHint}>Email cannot be changed</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <FontAwesomeIcon icon={faPhone} size={18} color={Colors.light.textTertiary} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor={Colors.light.textTertiary}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error.message}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button - Bottom */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.saveButtonFull, !hasChanges && styles.saveButtonFullDisabled]}
          onPress={handleSave}
          disabled={!hasChanges || updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} size={18} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.textTertiary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatarHint: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  formSection: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
  },
  inputDisabled: {
    backgroundColor: Colors.light.border,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.light.text,
  },
  inputTextDisabled: {
    color: Colors.light.textTertiary,
  },
  inputHint: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.light.textTertiary,
  },
  errorContainer: {
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 14,
  },
  bottomActions: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  saveButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonFullDisabled: {
    backgroundColor: Colors.light.textTertiary,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
