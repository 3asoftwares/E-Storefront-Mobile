import { 
  Colors, 
  Spacing, 
  BorderRadius, 
  FontSizes, 
  FontWeights,
  Shadows 
} from '../../constants/theme';

describe('Theme Constants', () => {
  describe('Colors', () => {
    describe('Light Theme', () => {
      it('should have primary colors', () => {
        expect(Colors.light.primary).toBe('#6366F1');
        expect(Colors.light.primaryLight).toBe('#818CF8');
        expect(Colors.light.primaryDark).toBe('#4F46E5');
      });

      it('should have accent colors', () => {
        expect(Colors.light.accent).toBe('#FF6B6B');
        expect(Colors.light.accentLight).toBe('#FF8A8A');
        expect(Colors.light.accentDark).toBe('#E85555');
      });

      it('should have secondary colors', () => {
        expect(Colors.light.secondary).toBe('#14B8A6');
        expect(Colors.light.secondaryLight).toBe('#2DD4BF');
        expect(Colors.light.secondaryDark).toBe('#0D9488');
      });

      it('should have status colors', () => {
        expect(Colors.light.success).toBe('#22C55E');
        expect(Colors.light.warning).toBe('#F59E0B');
        expect(Colors.light.error).toBe('#EF4444');
        expect(Colors.light.info).toBe('#0EA5E9');
      });

      it('should have background colors', () => {
        expect(Colors.light.background).toBe('#FAFAFA');
        expect(Colors.light.surface).toBe('#FFFFFF');
        expect(Colors.light.surfaceSecondary).toBe('#F0F0F2');
      });

      it('should have text colors', () => {
        expect(Colors.light.text).toBe('#1A1A2E');
        expect(Colors.light.textSecondary).toBe('#6B7280');
        expect(Colors.light.textTertiary).toBe('#9CA3AF');
        expect(Colors.light.textInverse).toBe('#FFFFFF');
      });

      it('should have border colors', () => {
        expect(Colors.light.border).toBe('#E5E7EB');
        expect(Colors.light.borderLight).toBe('#F3F4F6');
        expect(Colors.light.borderDark).toBe('#D1D5DB');
      });

      it('should have e-commerce special colors', () => {
        expect(Colors.light.sale).toBe('#FF4757');
        expect(Colors.light.newTag).toBe('#00D9A5');
        expect(Colors.light.bestseller).toBe('#FFB800');
      });

      it('should have gradient colors', () => {
        expect(Colors.light.gradientStart).toBe('#6366F1');
        expect(Colors.light.gradientEnd).toBe('#8B5CF6');
      });

      it('should have skeleton colors', () => {
        expect(Colors.light.skeleton).toBe('#E5E7EB');
        expect(Colors.light.skeletonHighlight).toBe('#F3F4F6');
      });
    });

    describe('Dark Theme', () => {
      it('should have primary colors', () => {
        expect(Colors.dark.primary).toBe('#818CF8');
        expect(Colors.dark.primaryLight).toBe('#A5B4FC');
        expect(Colors.dark.primaryDark).toBe('#6366F1');
      });

      it('should have accent colors', () => {
        expect(Colors.dark.accent).toBe('#FF8A8A');
        expect(Colors.dark.accentLight).toBe('#FFA8A8');
        expect(Colors.dark.accentDark).toBe('#FF6B6B');
      });

      it('should have secondary colors', () => {
        expect(Colors.dark.secondary).toBe('#2DD4BF');
        expect(Colors.dark.secondaryLight).toBe('#5EEAD4');
        expect(Colors.dark.secondaryDark).toBe('#14B8A6');
      });
    });
  });

  describe('Spacing', () => {
    it('should have all spacing values', () => {
      expect(Spacing.xs).toBe(4);
      expect(Spacing.sm).toBe(8);
      expect(Spacing.md).toBe(12);
      expect(Spacing.base).toBe(16);
      expect(Spacing.lg).toBe(20);
      expect(Spacing.xl).toBe(24);
      expect(Spacing['2xl']).toBe(32);
    });

    it('should have spacing values in ascending order', () => {
      expect(Spacing.xs).toBeLessThan(Spacing.sm);
      expect(Spacing.sm).toBeLessThan(Spacing.md);
      expect(Spacing.md).toBeLessThan(Spacing.base);
      expect(Spacing.base).toBeLessThan(Spacing.lg);
      expect(Spacing.lg).toBeLessThan(Spacing.xl);
    });
  });

  describe('BorderRadius', () => {
    it('should have all border radius values', () => {
      expect(BorderRadius.none).toBe(0);
      expect(BorderRadius.xs).toBe(4);
      expect(BorderRadius.sm).toBe(6);
      expect(BorderRadius.md).toBe(12);
      expect(BorderRadius.lg).toBe(16);
      expect(BorderRadius.xl).toBe(20);
      expect(BorderRadius.full).toBe(9999);
    });

    it('should have proper full radius for circular elements', () => {
      expect(BorderRadius.full).toBeGreaterThan(1000);
    });
  });

  describe('FontSizes', () => {
    it('should have all font size values', () => {
      expect(FontSizes.xs).toBe(10);
      expect(FontSizes.sm).toBe(12);
      expect(FontSizes.base).toBe(14);
      expect(FontSizes.md).toBe(16);
      expect(FontSizes.lg).toBe(18);
      expect(FontSizes.xl).toBe(20);
      expect(FontSizes['2xl']).toBe(24);
    });

    it('should have font sizes in ascending order', () => {
      expect(FontSizes.xs).toBeLessThan(FontSizes.sm);
      expect(FontSizes.sm).toBeLessThan(FontSizes.base);
      expect(FontSizes.base).toBeLessThan(FontSizes.md);
      expect(FontSizes.md).toBeLessThan(FontSizes.lg);
      expect(FontSizes.lg).toBeLessThan(FontSizes.xl);
      expect(FontSizes.xl).toBeLessThan(FontSizes['2xl']);
    });
  });

  describe('FontWeights', () => {
    it('should have all font weight values', () => {
      expect(FontWeights.normal).toBe('400');
      expect(FontWeights.medium).toBe('500');
      expect(FontWeights.semibold).toBe('600');
      expect(FontWeights.bold).toBe('700');
      expect(FontWeights.extrabold).toBe('800');
      expect(FontWeights.black).toBe('900');
    });
  });

  describe('Shadows', () => {
    it('should have small shadow', () => {
      expect(Shadows.sm).toBeDefined();
      expect(Shadows.sm.shadowOpacity).toBeDefined();
    });

    it('should have medium shadow', () => {
      expect(Shadows.md).toBeDefined();
      expect(Shadows.md.shadowOffset).toBeDefined();
    });

    it('should have large shadow', () => {
      expect(Shadows.lg).toBeDefined();
      expect(Shadows.lg.shadowRadius).toBeGreaterThan(Shadows.sm.shadowRadius);
    });

    it('should have elevation for Android', () => {
      expect(Shadows.sm.elevation).toBeDefined();
      expect(Shadows.md.elevation).toBeDefined();
      expect(Shadows.lg.elevation).toBeDefined();
      expect(typeof Shadows.md.elevation).toBe('number');
    });
  });
});
