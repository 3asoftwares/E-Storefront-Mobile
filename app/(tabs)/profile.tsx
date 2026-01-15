import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBox,
  faShoppingCart,
  faHeart,
  faMapMarkerAlt,
  faBell,
  faLock,
  faComments,
  faFileAlt,
  faShieldAlt,
  faSignOutAlt,
  faChevronRight,
  faUser,
  faSearch,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { useCartStore } from '../../src/store/cartStore';
import { useCurrentUser, useLogout, useOrders } from '../../src/lib/hooks';
import { Colors } from '../../src/constants/theme';
import { showConfirm, showAlert } from '../../src/utils/helpers';

// Menu Item Component
function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  showBadge,
  badgeCount,
}: {
  icon: IconDefinition;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeCount?: number;
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
      <View style={styles.menuItemRight}>
        {showBadge && badgeCount && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
        <FontAwesomeIcon icon={faChevronRight} size={14} color={Colors.light.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

// Stats Card Component
function StatsCard({ icon, label, value }: { icon: IconDefinition; label: string; value: number }) {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statsIconContainer}>
        <FontAwesomeIcon icon={icon} size={20} color={Colors.light.primary} />
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  );
}

// Guest View Component
function GuestView() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.guestContainer}>
        <View style={styles.guestIconContainer}>
          <FontAwesomeIcon icon={faUser} size={48} color={Colors.light.textTertiary} />
        </View>
        <Text style={styles.guestTitle}>Welcome, Guest!</Text>
        <Text style={styles.guestSubtitle}>Sign in to access your profile, orders, and more</Text>
        <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/login')}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('/signup')}>
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <MenuItem
          icon={faShoppingCart}
          title="View Cart"
          subtitle="Check your shopping cart"
          onPress={() => router.push('/cart')}
        />
        <MenuItem
          icon={faHeart}
          title="Wishlist"
          subtitle="Items you've saved"
          onPress={() => router.push('/wishlist')}
        />
        <MenuItem
          icon={faSearch}
          title="Browse Products"
          subtitle="Explore our catalog"
          onPress={() => router.push('/products')}
        />
      </View>
    </SafeAreaView>
  );
}

// Main Profile Screen
export default function ProfileScreen() {
  const userProfile = useCartStore((state) => state.userProfile);
  const cart = useCartStore((state) => state.items);
  const wishlist = useCartStore((state) => state.wishlist);

  const { data: currentUser, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: ordersData, isLoading: ordersLoading } = useOrders(userProfile?.id);
  const { logout, isLoading: logoutLoading } = useLogout();

  const orders = ordersData || [];
  const cartItemCount = cart.length;

  // If not authenticated error or no user profile and not loading, show guest view
  if ((!userProfile && !userLoading) || userError?.message?.includes('Not authenticated')) {
    return <GuestView />;
  }

  if (userLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    showConfirm(
      'Sign Out',
      'Are you sure you want to sign out?',
      () => logout(),
      undefined,
      'Sign Out'
    );
  };

  const user = currentUser || userProfile;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push('/edit-profile' as any)}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatsCard icon={faBox} label="Orders" value={orders.length} />
          <StatsCard icon={faShoppingCart} label="Cart" value={cartItemCount} />
          <StatsCard icon={faHeart} label="Wishlist" value={wishlist.length} />
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>My Account</Text>
          <MenuItem
            icon={faBox}
            title="My Orders"
            subtitle="View your order history"
            onPress={() => router.push('/orders')}
            showBadge
            badgeCount={orders.filter((o: any) => o.orderStatus === 'PENDING').length}
          />
          <MenuItem
            icon={faMapMarkerAlt}
            title="Addresses"
            subtitle="Manage your addresses"
            onPress={() => router.push('/addresses')}
          />
          <MenuItem
            icon={faHeart}
            title="Wishlist"
            subtitle={`${wishlist.length} items saved`}
            onPress={() => router.push('/wishlist')}
          />
          <MenuItem
            icon={faShoppingCart}
            title="Shopping Cart"
            subtitle={`${cartItemCount} items`}
            onPress={() => router.push('/cart')}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <MenuItem
            icon={faBell}
            title="Notifications"
            subtitle="Manage notifications"
            onPress={() => showAlert('Coming Soon', 'Notification settings will be available soon')}
          />
          <MenuItem
            icon={faLock}
            title="Privacy & Security"
            subtitle="Password, 2FA, and more"
            onPress={() => router.push('/privacy-security' as any)}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <MenuItem
            icon={faComments}
            title="Help Center"
            subtitle="FAQs and support"
            onPress={() => router.push('/help-center' as any)}
          />
          <MenuItem
            icon={faFileAlt}
            title="Terms of Service"
            subtitle="Legal information"
            onPress={() => router.push('/terms-of-service' as any)}
          />
          <MenuItem
            icon={faShieldAlt}
            title="Privacy Policy"
            subtitle="How we use your data"
            onPress={() => router.push('/privacy-policy' as any)}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={logoutLoading}
        >
          {logoutLoading ? (
            <ActivityIndicator size="small" color={Colors.light.error} />
          ) : (
            <>
              <FontAwesomeIcon icon={faSignOutAlt} size={18} color={Colors.light.error} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </>
          )}
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>

        <View style={{ height: Platform.OS === 'ios' ? 100 : 84 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
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
  guestContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  guestIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 20,
  },
  guestSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  signInButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 28,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  signUpButton: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    padding: 16,
  },
  profileHeader: {
    backgroundColor: Colors.light.background,
    padding: 28,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  editProfileButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editProfileText: {
    color: Colors.light.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  statsCard: {
    alignItems: 'center',
    minWidth: 90,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  menuSection: {
    marginTop: 24,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    paddingVertical: 12,
    letterSpacing: 0.3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
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
  },
  menuTextContainer: {
    marginLeft: 14,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.light.error,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.error,
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: Colors.light.textTertiary,
    fontSize: 12,
    marginTop: 24,
  },
});
