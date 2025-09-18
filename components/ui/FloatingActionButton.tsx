import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  loading?: boolean;
}

export function FloatingActionButton({ 
  onPress, 
  icon, 
  label, 
  variant = 'primary',
  disabled = false,
  loading = false
}: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    };

    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary + '20',
          borderColor: colors.secondary,
        };
      case 'accent':
        return {
          backgroundColor: colors.accent + '20',
          borderColor: colors.accent,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.secondary;
      case 'accent':
        return colors.accent;
      default:
        return 'white';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.secondary;
      case 'accent':
        return colors.accent;
      default:
        return 'white';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <IconSymbol 
          name={loading ? "arrow.clockwise" : icon} 
          size={20} 
          color={getIconColor()} 
        />
        <ThemedText style={[styles.label, { color: getTextColor() }]}>
          {loading ? 'Cargando...' : label}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    minWidth: 140,
    gap: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
