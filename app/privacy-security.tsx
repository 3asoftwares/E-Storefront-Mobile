import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faArrowLeft,
    faLock,
    faKey,
    faEye,
    faEyeSlash,
    faChevronRight,
    faShieldAlt,
    faFingerprint,
} from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../src/constants/theme';
import { useChangePassword } from '../src/lib/hooks';

// Menu Item Component
function SecurityMenuItem({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
}: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
}) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                    <FontAwesomeIcon icon={icon} size={18} color={Colors.light.primary} />
                </View>
                <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{title}</Text>
                    {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {rightElement || <FontAwesomeIcon icon={faChevronRight} size={14} color={Colors.light.textTertiary} />}
        </TouchableOpacity>
    );
}

// Change Password Modal Content
function ChangePasswordForm({ onClose }: { onClose: () => void }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { changePassword, isLoading, error } = useChangePassword();

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert('Error', 'New password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        try {
            await changePassword({ currentPassword, newPassword });
            Alert.alert('Success', 'Password changed successfully', [
                { text: 'OK', onPress: onClose },
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to change password');
        }
    };

    return (
        <View style={styles.formContainer}>
            <View style={styles.formHeader}>
                <FontAwesomeIcon icon={faKey} size={24} color={Colors.light.primary} />
                <Text style={styles.formTitle}>Change Password</Text>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <View style={styles.inputContainer}>
                    <FontAwesomeIcon icon={faLock} size={16} color={Colors.light.textTertiary} />
                    <TextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Enter current password"
                        placeholderTextColor={Colors.light.textTertiary}
                        secureTextEntry={!showCurrentPassword}
                    />
                    <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                        <FontAwesomeIcon
                            icon={showCurrentPassword ? faEyeSlash : faEye}
                            size={16}
                            color={Colors.light.textTertiary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.inputContainer}>
                    <FontAwesomeIcon icon={faLock} size={16} color={Colors.light.textTertiary} />
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Enter new password"
                        placeholderTextColor={Colors.light.textTertiary}
                        secureTextEntry={!showNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                        <FontAwesomeIcon
                            icon={showNewPassword ? faEyeSlash : faEye}
                            size={16}
                            color={Colors.light.textTertiary}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.inputHint}>At least 8 characters</Text>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <View style={styles.inputContainer}>
                    <FontAwesomeIcon icon={faLock} size={16} color={Colors.light.textTertiary} />
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm new password"
                        placeholderTextColor={Colors.light.textTertiary}
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                            size={16}
                            color={Colors.light.textTertiary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error.message}</Text>
                </View>
            )}

            <View style={styles.formActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                    onPress={handleChangePassword}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Update Password</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function PrivacySecurityScreen() {
    const [showChangePassword, setShowChangePassword] = useState(false);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={20} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy & Security</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroIcon}>
                        <FontAwesomeIcon icon={faShieldAlt} size={32} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.heroTitle}>Secure Your Account</Text>
                    <Text style={styles.heroSubtitle}>Manage your password and security settings</Text>
                </View>

                {showChangePassword ? (
                    <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
                ) : (
                    <>
                        {/* Password Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Password</Text>
                            <SecurityMenuItem
                                icon={faKey}
                                title="Change Password"
                                subtitle="Update your account password"
                                onPress={() => setShowChangePassword(true)}
                            />
                        </View>

                        {/* Security Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Security Options</Text>
                            <SecurityMenuItem
                                icon={faFingerprint}
                                title="Two-Factor Authentication"
                                subtitle="Add extra security to your account"
                                onPress={() => Alert.alert('Coming Soon', '2FA will be available in a future update')}
                            />
                            <SecurityMenuItem
                                icon={faShieldAlt}
                                title="Login Activity"
                                subtitle="View your recent login sessions"
                                onPress={() => Alert.alert('Coming Soon', 'Login activity will be available in a future update')}
                            />
                        </View>

                        {/* Privacy Info */}
                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Your Privacy Matters</Text>
                            <Text style={styles.infoText}>
                                We use industry-standard encryption to protect your data. Your password is never stored in plain text.
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/privacy-policy' as any)}>
                                <Text style={styles.infoLink}>Read our Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
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
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    heroSection: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: Colors.light.surfaceSecondary,
    },
    heroIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.light.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 12,
    },
    heroSubtitle: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        marginTop: 4,
    },
    section: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.light.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.light.surfaceSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
    },
    menuSubtitle: {
        fontSize: 13,
        color: Colors.light.textSecondary,
        marginTop: 2,
    },
    infoCard: {
        margin: 16,
        padding: 16,
        backgroundColor: Colors.light.surfaceSecondary,
        borderRadius: 12,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        lineHeight: 20,
    },
    infoLink: {
        fontSize: 14,
        color: Colors.light.primary,
        fontWeight: '500',
        marginTop: 12,
    },
    formContainer: {
        padding: 20,
    },
    formHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginTop: 12,
    },
    inputGroup: {
        marginBottom: 16,
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
        gap: 12,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: Colors.light.text,
    },
    inputHint: {
        marginTop: 6,
        fontSize: 12,
        color: Colors.light.textTertiary,
    },
    errorContainer: {
        padding: 12,
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: Colors.light.error,
        fontSize: 14,
    },
    formActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: Colors.light.surfaceSecondary,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
    submitButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
