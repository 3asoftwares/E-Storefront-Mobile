import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faComments,
  faEnvelope,
  faPhone,
  faQuestionCircle,
  faChevronDown,
  faChevronUp,
  faSearch,
  faShoppingBag,
  faTruck,
  faCreditCard,
  faUndo,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { Colors } from '../src/constants/theme';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <FontAwesomeIcon
          icon={expanded ? faChevronUp : faChevronDown}
          size={14}
          color={Colors.light.textSecondary}
        />
      </View>
      {expanded && <Text style={styles.faqAnswer}>{answer}</Text>}
    </TouchableOpacity>
  );
}

// Help Category Component
function HelpCategory({
  icon,
  title,
  description,
}: {
  icon: IconDefinition;
  title: string;
  description: string;
}) {
  return (
    <TouchableOpacity style={styles.categoryCard} activeOpacity={0.7}>
      <View style={styles.categoryIcon}>
        <FontAwesomeIcon icon={icon} size={20} color={Colors.light.primary} />
      </View>
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={styles.categoryDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

export default function HelpCenterScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I track my order?',
      answer:
        'You can track your order by going to "My Orders" in your profile. Each order has a tracking number that you can use to monitor delivery status.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day return policy for most items. Products must be unused and in original packaging. Some items like personalized products may not be eligible for returns.',
    },
    {
      question: 'How do I change my shipping address?',
      answer:
        'You can manage your addresses in "Addresses" under your profile. To change the address for an existing order, please contact our support team within 24 hours of placing the order.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are securely encrypted.',
    },
    {
      question: 'How do I apply a coupon code?',
      answer:
        'You can enter your coupon code on the cart page before checkout. Look for the "Have a coupon?" section and enter your code there.',
    },
    {
      question: 'My order arrived damaged. What should I do?',
      answer:
        'We apologize for any inconvenience. Please contact our support team within 48 hours with photos of the damaged item. We will arrange a replacement or refund.',
    },
  ];

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@3asoftwares.com');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <FontAwesomeIcon icon={faComments} size={40} color={Colors.light.primary} />
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSubtitle}>
            Find answers to common questions or contact our support team
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <FontAwesomeIcon icon={faSearch} size={16} color={Colors.light.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.textTertiary}
          />
        </View>

        {/* Help Categories */}
        <Text style={styles.sectionTitle}>Browse Topics</Text>
        <View style={styles.categoriesGrid}>
          <HelpCategory icon={faShoppingBag} title="Orders" description="Track & manage" />
          <HelpCategory icon={faTruck} title="Shipping" description="Delivery info" />
          <HelpCategory icon={faUndo} title="Returns" description="Refunds & exchanges" />
          <HelpCategory icon={faCreditCard} title="Payments" description="Billing help" />
          <HelpCategory icon={faUserShield} title="Account" description="Settings & security" />
          <HelpCategory icon={faQuestionCircle} title="General" description="Other questions" />
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </View>

        {/* Contact Section */}
        <Text style={styles.sectionTitle}>Still need help?</Text>
        <View style={styles.contactSection}>
          <TouchableOpacity style={styles.contactButton} onPress={handleEmailSupport}>
            <View style={styles.contactIconContainer}>
              <FontAwesomeIcon icon={faEnvelope} size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email Us</Text>
              <Text style={styles.contactDetail}>support@3asoftwares.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleCallSupport}>
            <View style={styles.contactIconContainer}>
              <FontAwesomeIcon icon={faPhone} size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Call Us</Text>
              <Text style={styles.contactDetail}>Available Mon-Fri, 9AM-6PM</Text>
            </View>
          </TouchableOpacity>
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
  },
  heroSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.light.surfaceSecondary,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 16,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    margin: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.light.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 8,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  categoryDescription: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  faqContainer: {
    paddingHorizontal: 16,
  },
  faqItem: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  contactSection: {
    paddingHorizontal: 16,
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  contactDetail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
});
