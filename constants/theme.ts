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
    background: '#F8F9FA',
    tint: '#007AFF',
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#007AFF',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    cardShadow: 'rgba(0, 0, 0, 0.05)',
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    surface: 'rgba(255, 255, 255, 0.8)',
    surfaceVariant: 'rgba(248, 249, 250, 0.8)',
    outline: 'rgba(198, 198, 200, 0.5)',
    // Colores minimalistas para clima
    weather: {
      clear: '#FFD700',
      cloudy: '#B0C4DE',
      rain: '#4682B4',
      snow: '#F0F8FF',
      storm: '#8A2BE2',
      fog: '#D3D3D3',
    },
    // Gradientes sutiles
    gradients: {
      primary: ['rgba(0, 122, 255, 0.1)', 'rgba(0, 122, 255, 0.05)'],
      success: ['rgba(52, 199, 89, 0.1)', 'rgba(52, 199, 89, 0.05)'],
      warning: ['rgba(255, 149, 0, 0.1)', 'rgba(255, 149, 0, 0.05)'],
      error: ['rgba(255, 59, 48, 0.1)', 'rgba(255, 59, 48, 0.05)'],
    }
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: '#0A84FF',
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#0A84FF',
    cardBackground: 'rgba(28, 28, 30, 0.95)',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    surface: 'rgba(28, 28, 30, 0.8)',
    surfaceVariant: 'rgba(44, 44, 46, 0.8)',
    outline: 'rgba(56, 56, 58, 0.5)',
    // Colores minimalistas para clima
    weather: {
      clear: '#FFD700',
      cloudy: '#B0C4DE',
      rain: '#4682B4',
      snow: '#F0F8FF',
      storm: '#8A2BE2',
      fog: '#D3D3D3',
    },
    // Gradientes sutiles
    gradients: {
      primary: ['rgba(10, 132, 255, 0.1)', 'rgba(10, 132, 255, 0.05)'],
      success: ['rgba(48, 209, 88, 0.1)', 'rgba(48, 209, 88, 0.05)'],
      warning: ['rgba(255, 159, 10, 0.1)', 'rgba(255, 159, 10, 0.05)'],
      error: ['rgba(255, 69, 58, 0.1)', 'rgba(255, 69, 58, 0.05)'],
    }
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
