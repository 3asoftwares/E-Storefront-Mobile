import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../src/constants/theme';

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon icon={faFileAlt} size={40} color={Colors.light.primary} />
        </View>

        <Text style={styles.lastUpdated}>Last updated: January 10, 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By accessing and using this application, you accept and agree to be bound by the terms
            and provisions of this agreement. If you do not agree to these terms, please do not use
            our services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. User Accounts</Text>
          <Text style={styles.sectionText}>
            When you create an account with us, you must provide accurate and complete information.
            You are responsible for:
          </Text>
          <Text style={styles.bulletPoint}>• Maintaining the security of your account</Text>
          <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
          <Text style={styles.bulletPoint}>• Notifying us of any unauthorized access</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Products and Services</Text>
          <Text style={styles.sectionText}>
            We strive to display accurate product information, but we do not warrant that
            descriptions, pricing, or other content is error-free. We reserve the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Limit quantities of items purchased</Text>
          <Text style={styles.bulletPoint}>• Refuse service to anyone</Text>
          <Text style={styles.bulletPoint}>• Discontinue products at any time</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Pricing and Payment</Text>
          <Text style={styles.sectionText}>
            All prices are displayed in USD unless otherwise noted. We accept major credit cards and
            other payment methods as indicated at checkout. Payment must be received before order
            processing.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Shipping and Delivery</Text>
          <Text style={styles.sectionText}>
            Shipping times are estimates only and not guaranteed. We are not responsible for delays
            caused by shipping carriers, customs, or other factors beyond our control.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Returns and Refunds</Text>
          <Text style={styles.sectionText}>
            Our return policy allows returns within 30 days of delivery for most items. Items must
            be in original condition with tags attached. Refunds will be processed to the original
            payment method.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
          <Text style={styles.sectionText}>
            All content on this application, including text, graphics, logos, and software, is the
            property of 3A Softwares and protected by intellectual property laws. Unauthorized use
            is prohibited.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
          <Text style={styles.sectionText}>
            We shall not be liable for any indirect, incidental, special, or consequential damages
            arising from your use of our services. Our total liability shall not exceed the amount
            paid for the product or service in question.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
          <Text style={styles.sectionText}>
            We reserve the right to modify these terms at any time. Continued use of our services
            after changes constitutes acceptance of the new terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Information</Text>
          <Text style={styles.sectionText}>
            For questions about these Terms of Service, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>legal@3asoftwares.com</Text>
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
