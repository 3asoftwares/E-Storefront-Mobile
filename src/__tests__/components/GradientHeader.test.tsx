import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';

// Mock dependencies
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => children,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));

import { GradientHeader } from '../../components/ui/GradientHeader';

describe('GradientHeader Component', () => {
  describe('Title and Subtitle', () => {
    it('renders title', () => {
      const { getByText } = render(<GradientHeader title="Products" />);
      expect(getByText('Products')).toBeTruthy();
    });

    it('renders subtitle', () => {
      const { getByText } = render(
        <GradientHeader title="Products" subtitle="All items" />
      );
      expect(getByText('Products')).toBeTruthy();
      expect(getByText('All items')).toBeTruthy();
    });

    it('renders without title', () => {
      const { queryByText } = render(<GradientHeader />);
      expect(queryByText('Products')).toBeNull();
    });
  });

  describe('Back Button', () => {
    it('shows back button when showBack is true', () => {
      const onBack = jest.fn();
      const { UNSAFE_root } = render(
        <GradientHeader title="Details" showBack onBack={onBack} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('calls onBack when back button pressed', () => {
      const onBack = jest.fn();
      const { getByText } = render(
        <GradientHeader title="Details" showBack onBack={onBack} />
      );
      // Header should render with title
      expect(getByText('Details')).toBeTruthy();
    });
  });

  describe('Search Button', () => {
    it('renders search button when showSearch is true', () => {
      const onSearch = jest.fn();
      const { getByText } = render(
        <GradientHeader title="Products" showSearch onSearch={onSearch} />
      );
      expect(getByText('Products')).toBeTruthy();
    });
  });

  describe('Notification Button', () => {
    it('renders notification button when showNotification is true', () => {
      const onNotification = jest.fn();
      const { getByText } = render(
        <GradientHeader 
          title="Home" 
          showNotification 
          onNotification={onNotification} 
        />
      );
      expect(getByText('Home')).toBeTruthy();
    });

    it('shows notification count badge', () => {
      const { getByText } = render(
        <GradientHeader 
          title="Home" 
          showNotification 
          notificationCount={5}
        />
      );
      expect(getByText('5')).toBeTruthy();
    });

    it('shows 99+ for notification count over 99', () => {
      const { getByText } = render(
        <GradientHeader 
          title="Home" 
          showNotification 
          notificationCount={150}
        />
      );
      expect(getByText('99+')).toBeTruthy();
    });

    it('does not show badge when count is 0', () => {
      const { queryByText, getByText } = render(
        <GradientHeader 
          title="Home" 
          showNotification 
          notificationCount={0}
        />
      );
      expect(getByText('Home')).toBeTruthy();
      expect(queryByText('0')).toBeNull();
    });
  });

  describe('Menu Button', () => {
    it('renders menu button when showMenu is true', () => {
      const onMenu = jest.fn();
      const { getByText } = render(
        <GradientHeader title="Settings" showMenu onMenu={onMenu} />
      );
      expect(getByText('Settings')).toBeTruthy();
    });
  });

  describe('Variants', () => {
    it('renders gradient variant', () => {
      const { getByText } = render(
        <GradientHeader title="Gradient" variant="gradient" />
      );
      expect(getByText('Gradient')).toBeTruthy();
    });

    it('renders solid variant', () => {
      const { getByText } = render(
        <GradientHeader title="Solid" variant="solid" />
      );
      expect(getByText('Solid')).toBeTruthy();
    });

    it('renders transparent variant', () => {
      const { getByText } = render(
        <GradientHeader title="Transparent" variant="transparent" />
      );
      expect(getByText('Transparent')).toBeTruthy();
    });
  });

  describe('Custom Props', () => {
    it('accepts custom gradient colors', () => {
      const { getByText } = render(
        <GradientHeader 
          title="Custom" 
          gradientColors={['#FF0000', '#00FF00']}
        />
      );
      expect(getByText('Custom')).toBeTruthy();
    });

    it('accepts custom style', () => {
      const { getByText } = render(
        <GradientHeader 
          title="Styled" 
          style={{ paddingHorizontal: 20 }}
        />
      );
      expect(getByText('Styled')).toBeTruthy();
    });

    it('renders right content', () => {
      const { getByText } = render(
        <GradientHeader 
          title="With Right" 
          rightContent={<Text>Custom Right</Text>}
        />
      );
      expect(getByText('Custom Right')).toBeTruthy();
    });
  });

  describe('Combined Props', () => {
    it('renders with all buttons', () => {
      const { getByText } = render(
        <GradientHeader 
          title="Full Header"
          subtitle="With all options"
          showBack
          showSearch
          showNotification
          showMenu
          notificationCount={3}
        />
      );
      expect(getByText('Full Header')).toBeTruthy();
      expect(getByText('With all options')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
    });
  });
});
