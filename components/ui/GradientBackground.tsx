import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'weather' | 'card';
  weatherCode?: number;
}

export function GradientBackground({ 
  children, 
  variant = 'primary', 
  weatherCode 
}: GradientBackgroundProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getGradientColors = () => {
    if (variant === 'weather' && weatherCode !== undefined) {
      return getWeatherGradient(weatherCode, colorScheme);
    }

    switch (variant) {
      case 'primary':
        return colorScheme === 'dark' 
          ? ['#1C1C1E', '#2C2C2E', '#1C1C1E']
          : ['#F2F2F7', '#FFFFFF', '#F2F2F7'];
      
      case 'secondary':
        return colorScheme === 'dark'
          ? ['#2C2C2E', '#1C1C1E', '#2C2C2E']
          : ['#FFFFFF', '#F8F9FA', '#FFFFFF'];
      
      case 'card':
        return colorScheme === 'dark'
          ? ['#1C1C1E', '#2C2C2E']
          : ['#FFFFFF', '#F8F9FA'];
      
      default:
        return [colors.background, colors.background];
    }
  };

  const getWeatherGradient = (code: number, scheme: 'light' | 'dark' | null) => {
    const isDark = scheme === 'dark';
    
    // Cielo despejado
    if (code === 0 || code === 1) {
      return isDark 
        ? ['#1a1a2e', '#16213e', '#0f3460']
        : ['#87CEEB', '#98D8E8', '#B0E0E6'];
    }
    
    // Parcialmente nublado
    if (code === 2) {
      return isDark
        ? ['#2c3e50', '#34495e', '#2c3e50']
        : ['#B0C4DE', '#D3D3D3', '#E6E6FA'];
    }
    
    // Nublado
    if (code === 3) {
      return isDark
        ? ['#2c3e50', '#34495e', '#2c3e50']
        : ['#D3D3D3', '#C0C0C0', '#A9A9A9'];
    }
    
    // Lluvia
    if (code >= 61 && code <= 65) {
      return isDark
        ? ['#1e3c72', '#2a5298', '#1e3c72']
        : ['#4682B4', '#5F9EA0', '#87CEEB'];
    }
    
    // Nieve
    if (code >= 71 && code <= 77) {
      return isDark
        ? ['#2c3e50', '#34495e', '#2c3e50']
        : ['#F0F8FF', '#E6F3FF', '#CCE7FF'];
    }
    
    // Tormenta
    if (code >= 95 && code <= 99) {
      return isDark
        ? ['#0f0f23', '#1a1a2e', '#16213e']
        : ['#483D8B', '#6A5ACD', '#9370DB'];
    }
    
    // Niebla
    if (code === 45 || code === 48) {
      return isDark
        ? ['#2c3e50', '#34495e', '#2c3e50']
        : ['#D3D3D3', '#C0C0C0', '#A9A9A9'];
    }
    
    // Por defecto
    return isDark
      ? ['#1C1C1E', '#2C2C2E']
      : ['#F2F2F7', '#FFFFFF'];
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
