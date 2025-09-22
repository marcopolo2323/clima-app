import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

interface ModernCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'small' | 'medium' | 'large' | 'xl';
}

export function ModernCard({ 
  children, 
  style, 
  variant = 'default',
  padding = 'medium',
  borderRadius = 'large'
}: ModernCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 12,
        };
      
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.outline,
        };
      
      case 'filled':
        return {
          backgroundColor: colors.surfaceVariant,
        };
      
      default:
        return {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none': return { padding: 0 };
      case 'small': return { padding: 12 };
      case 'medium': return { padding: 16 };
      case 'large': return { padding: 24 };
      default: return { padding: 16 };
    }
  };

  const getBorderRadiusStyles = () => {
    switch (borderRadius) {
      case 'small': return { borderRadius: 8 };
      case 'medium': return { borderRadius: 12 };
      case 'large': return { borderRadius: 16 };
      case 'xl': return { borderRadius: 24 };
      default: return { borderRadius: 16 };
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        getVariantStyles(),
        getPaddingStyles(),
        getBorderRadiusStyles(),
        style,
      ]}
    >
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
