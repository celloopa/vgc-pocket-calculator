/**
 * Design System Tokens
 * Pokemon-themed mobile design system
 */

/**
 * Spacing Scale (4px base unit)
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/**
 * Border Radius
 */
export const BorderRadius = {
  sm: 8,
  md: 12,
  card: 16, // Playful rounded corners for cards
  pill: 20, // Chip/pill shape
  round: 9999, // Fully rounded
} as const;

/**
 * Typography
 */
export const Typography = {
  // Font families (uses system fonts)
  fontRegular: 'System',
  fontMedium: 'System',
  fontBold: 'System',

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * Layout
 */
export const Layout = {
  // Card heights
  cardCollapsed: 60,
  cardExpanded: 300,

  // Touch targets (minimum 44pt for accessibility)
  minTouchTarget: 44,

  // Screen breakpoints
  breakpoints: {
    small: 380, // Small phones
    medium: 430, // Standard phones
    large: 768, // Tablets
  },

  // Container padding
  containerPadding: Spacing.lg,
} as const;

/**
 * Shadows (iOS-style)
 */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

/**
 * Animation Timing
 */
export const Animation = {
  // Spring physics for natural motion
  spring: {
    damping: 20,
    stiffness: 200,
  },

  // Timing durations
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Easing (for timing-based animations)
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
  },
} as const;

/**
 * Z-Index layers
 */
export const ZIndex = {
  background: 0,
  content: 1,
  sticky: 10,
  overlay: 100,
  modal: 1000,
  popover: 1100,
  toast: 1200,
} as const;
