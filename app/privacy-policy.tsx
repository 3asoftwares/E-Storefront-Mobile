import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../src/constants/theme';

export default function PrivacyPolicyScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={20} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.iconContainer}>
                    <FontAwesomeIcon icon={faShieldAlt} size={40} color={Colors.light.primary} />
                </View>
                
                <Text style={styles.lastUpdated}>Last updated: January 10, 2026</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Information We Collect</Text>
                    <Text style={styles.sectionText}>
                        We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes:
                    </Text>
                    <Text style={styles.bulletPoint}>• Name and email address</Text>
                    <Text style={styles.bulletPoint}>• Shipping and billing addresses</Text>
                    <Text style={styles.bulletPoint}>• Payment information</Text>
                    <Text style={styles.bulletPoint}>• Phone number</Text>
                    <Text style={styles.bulletPoint}>• Order history and preferences</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
                    <Text style={styles.sectionText}>
                        We use the information we collect to:
                    </Text>
                    <Text style={styles.bulletPoint}>• Process and fulfill your orders</Text>
                    <Text style={styles.bulletPoint}>• Send order confirmations and updates</Text>
                    <Text style={styles.bulletPoint}>• Provide customer support</Text>
                    <Text style={styles.bulletPoint}>• Personalize your shopping experience</Text>
                    <Text style={styles.bulletPoint}>• Send promotional communications (with your consent)</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Information Sharing</Text>
                    <Text style={styles.sectionText}>
                        We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as necessary to:
                    </Text>
                    <Text style={styles.bulletPoint}>• Process payments and fulfill orders</Text>
                    <Text style={styles.bulletPoint}>• Comply with legal requirements</Text>
                    <Text style={styles.bulletPoint}>• Protect our rights and safety</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Data Security</Text>
                    <Text style={styles.sectionText}>
                        We implement industry-standard security measures to protect your personal information. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Your Rights</Text>
                    <Text style={styles.sectionText}>
                        You have the right to:
                    </Text>
                    <Text style={styles.bulletPoint}>• Access your personal data</Text>
                    <Text style={styles.bulletPoint}>• Correct inaccurate data</Text>
                    <Text style={styles.bulletPoint}>• Request deletion of your data</Text>
                    <Text style={styles.bulletPoint}>• Opt-out of marketing communications</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Cookies</Text>
                    <Text style={styles.sectionText}>
                        We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie settings through your browser preferences.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Contact Us</Text>
                    <Text style={styles.sectionText}>
                        If you have questions about this Privacy Policy, please contact us at:
                    </Text>
                    <Text style={styles.contactInfo}>privacy@3asoftwares.com</Text>
                </View>

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
        padding: 20,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    lastUpdated: {
        fontSize: 14,
        color: Colors.light.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 12,
    },
    sectionText: {
        fontSize: 15,
        color: Colors.light.textSecondary,
        lineHeight: 24,
        marginBottom: 8,
    },
    bulletPoint: {
        fontSize: 15,
        color: Colors.light.textSecondary,
        lineHeight: 26,
        paddingLeft: 8,
    },
    contactInfo: {
        fontSize: 15,
        color: Colors.light.primary,
        marginTop: 8,
        fontWeight: '500',
    },
});
