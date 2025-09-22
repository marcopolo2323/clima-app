import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

interface WeatherBackgroundProps {
  weatherCode: number;
  children: React.ReactNode;
}

export function WeatherBackground({ weatherCode, children }: WeatherBackgroundProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Mapeo estático de imágenes de fondo
  const backgroundImages = {
    mañana: require('@/assets/images/mañana_fondo_app.jpg'),
    tarde: require('@/assets/images/tarde_fondo_app.jpg'),
    noche: require('@/assets/images/noche_fondo_app.jpg'),
    default: require('@/assets/images/fondo_app.jpg'),
  };

  // Obtener imagen de fondo basada en la hora del día
  const getBackgroundImage = (code: number) => {
    const hour = new Date().getHours();
    
    // Determinar período del día
    let timeOfDay = 'tarde'; // Por defecto
    if (hour >= 6 && hour < 12) {
      timeOfDay = 'mañana';
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 'tarde';
    } else {
      timeOfDay = 'noche';
    }
    
    // Retornar la imagen correspondiente
    return backgroundImages[timeOfDay as keyof typeof backgroundImages] || backgroundImages.default;
  };

  const getWeatherGradient = (code: number) => {
    const isDark = colorScheme === 'dark';
    
    // Gradientes que complementan las imágenes
    switch (true) {
      case code === 0 || code === 1: // Cielo despejado
        return isDark 
          ? ['rgba(255, 215, 0, 0.3)', 'rgba(135, 206, 235, 0.2)', 'rgba(30, 144, 255, 0.1)']
          : ['rgba(255, 215, 0, 0.4)', 'rgba(135, 206, 235, 0.3)', 'rgba(30, 144, 255, 0.2)'];
      
      case code === 2: // Parcialmente nublado
        return isDark
          ? ['rgba(176, 196, 222, 0.3)', 'rgba(211, 211, 211, 0.2)', 'rgba(169, 169, 169, 0.1)']
          : ['rgba(176, 196, 222, 0.4)', 'rgba(211, 211, 211, 0.3)', 'rgba(169, 169, 169, 0.2)'];
      
      case code === 3: // Nublado
        return isDark
          ? ['rgba(105, 105, 105, 0.4)', 'rgba(128, 128, 128, 0.3)', 'rgba(169, 169, 169, 0.2)']
          : ['rgba(105, 105, 105, 0.5)', 'rgba(128, 128, 128, 0.4)', 'rgba(169, 169, 169, 0.3)'];
      
      case code >= 61 && code <= 65: // Lluvia
        return isDark
          ? ['rgba(70, 130, 180, 0.4)', 'rgba(95, 158, 160, 0.3)', 'rgba(135, 206, 235, 0.2)']
          : ['rgba(70, 130, 180, 0.5)', 'rgba(95, 158, 160, 0.4)', 'rgba(135, 206, 235, 0.3)'];
      
      case code >= 71 && code <= 77: // Nieve
        return isDark
          ? ['rgba(240, 248, 255, 0.3)', 'rgba(230, 243, 255, 0.2)', 'rgba(204, 231, 255, 0.1)']
          : ['rgba(240, 248, 255, 0.4)', 'rgba(230, 243, 255, 0.3)', 'rgba(204, 231, 255, 0.2)'];
      
      case code >= 95 && code <= 99: // Tormenta
        return isDark
          ? ['rgba(72, 61, 139, 0.4)', 'rgba(106, 90, 205, 0.3)', 'rgba(147, 112, 219, 0.2)']
          : ['rgba(72, 61, 139, 0.5)', 'rgba(106, 90, 205, 0.4)', 'rgba(147, 112, 219, 0.3)'];
      
      case code === 45 || code === 48: // Niebla
        return isDark
          ? ['rgba(169, 169, 169, 0.4)', 'rgba(192, 192, 192, 0.3)', 'rgba(211, 211, 211, 0.2)']
          : ['rgba(169, 169, 169, 0.5)', 'rgba(192, 192, 192, 0.4)', 'rgba(211, 211, 211, 0.3)'];
      
      default:
        return isDark
          ? ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.2)']
          : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)'];
    }
  };

  return (
    <ImageBackground
      source={getBackgroundImage(weatherCode)}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={getWeatherGradient(weatherCode)}
        style={styles.overlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
});
