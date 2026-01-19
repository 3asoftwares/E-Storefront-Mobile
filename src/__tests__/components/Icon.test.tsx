import React from 'react';
import { render } from '@testing-library/react-native';
import { Colors } from '../../constants/theme';

// Mock FontAwesome packages before importing Icon
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, size, color }: any) => null,
}));

// Mock all FontAwesome icons to return a mock object
jest.mock('@fortawesome/free-solid-svg-icons', () => {
  const createMockIcon = (name: string) => ({ iconName: name, prefix: 'fas' });
  return {
    faHome: createMockIcon('home'),
    faShoppingCart: createMockIcon('shopping-cart'),
    faHeart: createMockIcon('heart'),
    faUser: createMockIcon('user'),
    faSearch: createMockIcon('search'),
    faPlus: createMockIcon('plus'),
    faMinus: createMockIcon('minus'),
    faTrash: createMockIcon('trash'),
    faTimes: createMockIcon('times'),
    faCheck: createMockIcon('check'),
    faChevronRight: createMockIcon('chevron-right'),
    faChevronLeft: createMockIcon('chevron-left'),
    faChevronDown: createMockIcon('chevron-down'),
    faChevronUp: createMockIcon('chevron-up'),
    faStar: createMockIcon('star'),
    faMapMarkerAlt: createMockIcon('map-marker'),
    faCreditCard: createMockIcon('credit-card'),
    faTruck: createMockIcon('truck'),
    faBox: createMockIcon('box'),
    faShoppingBag: createMockIcon('shopping-bag'),
    faCog: createMockIcon('cog'),
    faSignOutAlt: createMockIcon('sign-out'),
    faEnvelope: createMockIcon('envelope'),
    faPhone: createMockIcon('phone'),
    faLock: createMockIcon('lock'),
    faEye: createMockIcon('eye'),
    faEyeSlash: createMockIcon('eye-slash'),
    faEdit: createMockIcon('edit'),
    faFilter: createMockIcon('filter'),
    faSort: createMockIcon('sort'),
    faList: createMockIcon('list'),
    faThLarge: createMockIcon('th-large'),
    faBars: createMockIcon('bars'),
    faBell: createMockIcon('bell'),
    faTag: createMockIcon('tag'),
    faPercent: createMockIcon('percent'),
    faGift: createMockIcon('gift'),
    faHistory: createMockIcon('history'),
    faQuestionCircle: createMockIcon('question-circle'),
    faInfoCircle: createMockIcon('info-circle'),
    faExclamationCircle: createMockIcon('exclamation-circle'),
    faCheckCircle: createMockIcon('check-circle'),
    faTimesCircle: createMockIcon('times-circle'),
    faArrowLeft: createMockIcon('arrow-left'),
    faArrowRight: createMockIcon('arrow-right'),
    faShare: createMockIcon('share'),
    faBookmark: createMockIcon('bookmark'),
  };
});

jest.mock('@fortawesome/free-regular-svg-icons', () => {
  const createMockIcon = (name: string) => ({ iconName: name, prefix: 'far' });
  return {
    faHeart: createMockIcon('heart'),
    faBookmark: createMockIcon('bookmark'),
    faStar: createMockIcon('star'),
  };
});

import { Icon, IconWithBadge } from '../../components/ui/Icon';

describe('Icon', () => {
  it('should render icon with default props', () => {
    const { toJSON } = render(<Icon name="home" />);
    expect(toJSON()).toBeDefined();
  });

  it('should render icon with custom size', () => {
    const { toJSON } = render(<Icon name="shopping-cart" size={30} />);
    expect(toJSON()).toBeDefined();
  });

  it('should render icon with custom color', () => {
    const { toJSON } = render(<Icon name="heart" color="#FF0000" />);
    expect(toJSON()).toBeDefined();
  });

  it('should render icon with style prop', () => {
    const customStyle = { margin: 10 };
    const { toJSON } = render(<Icon name="user" style={customStyle} />);
    expect(toJSON()).toBeDefined();
  });

  it('should return null for invalid icon name', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { toJSON } = render(<Icon name={'invalid-icon' as any} />);
    expect(toJSON()).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Icon "invalid-icon" not found in icon map');
    consoleSpy.mockRestore();
  });

  describe('Icon names mapping', () => {
    const iconNames = [
      'home',
      'shopping-cart',
      'shopping-bag',
      'heart',
      'heart-outline',
      'user',
      'profile',
      'search',
      'plus',
      'minus',
      'trash',
      'delete',
      'close',
      'check',
      'edit',
      'share',
      'bookmark',
      'bookmark-outline',
      'chevron-right',
      'chevron-left',
      'chevron-down',
      'chevron-up',
      'arrow-left',
      'arrow-right',
      'star',
      'star-outline',
      'location',
      'map-marker',
      'credit-card',
      'payment',
      'truck',
      'shipping',
      'box',
      'package',
      'tag',
      'percent',
      'discount',
      'gift',
      'settings',
      'cog',
      'logout',
      'sign-out',
      'email',
      'envelope',
      'phone',
      'lock',
      'password',
      'eye',
      'eye-slash',
    ];

    iconNames.forEach((iconName) => {
      it(`should render ${iconName} icon`, () => {
        const { toJSON } = render(<Icon name={iconName as any} />);
        expect(toJSON()).toBeDefined();
      });
    });
  });
});

describe('IconWithBadge', () => {
  it('should render icon without badge when badgeCount is undefined', () => {
    const { toJSON } = render(<IconWithBadge name="shopping-cart" />);
    expect(toJSON()).toBeDefined();
  });

  it('should render icon without badge when badgeCount is 0', () => {
    const { toJSON } = render(<IconWithBadge name="shopping-cart" badgeCount={0} />);
    expect(toJSON()).toBeDefined();
  });

  it('should render icon with badge when badgeCount is greater than 0', () => {
    const { toJSON } = render(<IconWithBadge name="shopping-cart" badgeCount={5} />);
    expect(toJSON()).toBeDefined();
  });

  it('should render badge with custom color', () => {
    const customColor = '#00FF00';
    const { toJSON } = render(
      <IconWithBadge name="heart" badgeCount={3} badgeColor={customColor} />
    );
    expect(toJSON()).toBeDefined();
  });

  it('should render badge with default error color', () => {
    const { toJSON } = render(<IconWithBadge name="heart" badgeCount={10} />);
    expect(toJSON()).toBeDefined();
  });

  it('should pass icon props correctly', () => {
    const { toJSON } = render(
      <IconWithBadge name="shopping-cart" size={25} color={Colors.light.primary} badgeCount={2} />
    );
    expect(toJSON()).toBeDefined();
  });

  it('should handle large badge counts', () => {
    const { toJSON } = render(<IconWithBadge name="heart" badgeCount={99} />);
    expect(toJSON()).toBeDefined();
  });
});
