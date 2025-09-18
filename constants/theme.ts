/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

export const Colors = {
  light: {
    text: '#1C1C1E',
    background: '#F2F2F7',
    tint: tintColorLight,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    surface: '#FFFFFF',
    surfaceVariant: '#F2F2F7',
    outline: '#C6C6C8',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    cardBackground: '#1C1C1E',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    surface: '#1C1C1E',
    surfaceVariant: '#2C2C2E',
    outline: '#38383A',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
