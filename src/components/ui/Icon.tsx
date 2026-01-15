import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faShoppingCart,
  faHeart as faHeartSolid,
  faUser,
  faSearch,
  faPlus,
  faMinus,
  faTrash,
  faTimes,
  faCheck,
  faChevronRight,
  faChevronLeft,
  faChevronDown,
  faChevronUp,
  faStar,
  faMapMarkerAlt,
  faCreditCard,
  faTruck,
  faBox,
  faShoppingBag,
  faCog,
  faSignOutAlt,
  faEnvelope,
  faPhone,
  faLock,
  faEye,
  faEyeSlash,
  faEdit,
  faFilter,
  faSort,
  faList,
  faThLarge,
  faBars,
  faBell,
  faTag,
  faPercent,
  faGift,
  faHistory,
  faQuestionCircle,
  faInfoCircle,
  faExclamationCircle,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
  faArrowRight,
  faShare,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
  faStar as faStarRegular,
} from '@fortawesome/free-regular-svg-icons';
import { Colors } from '../../constants/theme';

// Icon name mapping
const iconMap: Record<string, IconDefinition> = {
  // Navigation
  home: faHome,
  cart: faShoppingCart,
  'shopping-cart': faShoppingCart,
  'shopping-bag': faShoppingBag,
  heart: faHeartSolid,
  'heart-outline': faHeartRegular,
  user: faUser,
  profile: faUser,
  search: faSearch,

  // Actions
  plus: faPlus,
  minus: faMinus,
  trash: faTrash,
  delete: faTrash,
  close: faTimes,
  check: faCheck,
  edit: faEdit,
  share: faShare,
  bookmark: faBookmark,
  'bookmark-outline': faBookmarkRegular,

  // Arrows & Chevrons
  'chevron-right': faChevronRight,
  'chevron-left': faChevronLeft,
  'chevron-down': faChevronDown,
  'chevron-up': faChevronUp,
  'arrow-left': faArrowLeft,
  'arrow-right': faArrowRight,

  // Rating
  star: faStar,
  'star-outline': faStarRegular,

  // E-commerce
  location: faMapMarkerAlt,
  'map-marker': faMapMarkerAlt,
  'credit-card': faCreditCard,
  payment: faCreditCard,
  truck: faTruck,
  shipping: faTruck,
  box: faBox,
  package: faBox,
  tag: faTag,
  percent: faPercent,
  discount: faPercent,
  gift: faGift,

  // User
  settings: faCog,
  cog: faCog,
  logout: faSignOutAlt,
  'sign-out': faSignOutAlt,
  email: faEnvelope,
  envelope: faEnvelope,
  phone: faPhone,
  lock: faLock,
  password: faLock,
  eye: faEye,
  'eye-slash': faEyeSlash,

  // UI
  filter: faFilter,
  sort: faSort,
  list: faList,
  grid: faThLarge,
  menu: faBars,
  bell: faBell,
  notification: faBell,
  history: faHistory,

  // Status
  question: faQuestionCircle,
  help: faQuestionCircle,
  info: faInfoCircle,
  warning: faExclamationCircle,
  error: faExclamationCircle,
  success: faCheckCircle,
  'check-circle': faCheckCircle,
  'times-circle': faTimesCircle,
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
}

export function Icon({ name, size = 20, color = Colors.light.text, style }: IconProps) {
  const icon = iconMap[name];

  if (!icon) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  return (
    <View style={style}>
      <FontAwesomeIcon icon={icon} size={size} color={color} />
    </View>
  );
}

// Badge component for icons with notifications
interface IconBadgeProps extends IconProps {
  badgeCount?: number;
  badgeColor?: string;
}

export function IconWithBadge({
  badgeCount,
  badgeColor = Colors.light.error,
  ...iconProps
}: IconBadgeProps) {
  return (
    <View style={styles.badgeContainer}>
      <Icon {...iconProps} />
      {badgeCount !== undefined && badgeCount > 0 && (
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <View style={styles.badgeTextContainer}>
            {/* Using a smaller icon or number would go here */}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Icon;
