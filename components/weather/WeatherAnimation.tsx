import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface WeatherAnimationProps {
  weatherCode: number;
  size?: number;
}

export function WeatherAnimation({ weatherCode, size = 100 }: WeatherAnimationProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    // Animación de rotación para viento
    if (weatherCode >= 61 && weatherCode <= 65) { // Lluvia
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000 }),
        -1,
        false
      );
    }

    // Animación de escala para tormentas
    if (weatherCode >= 95 && weatherCode <= 99) { // Tormenta
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    }

    // Animación de opacidad para niebla
    if (weatherCode === 45 || weatherCode === 48) { // Niebla
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1000 }),
          withTiming(0.8, { duration: 1000 })
        ),
        -1,
        true
      );
    }

    // Animación suave de aparición
    scale.value = withTiming(1, { duration: 500 });
    opacity.value = withTiming(1, { duration: 500 });
  }, [weatherCode]);

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return 'sun.max.fill';
    if (code === 2) return 'cloud.sun.fill';
    if (code === 3) return 'cloud.fill';
    if (code >= 45 && code <= 48) return 'cloud.fog.fill';
    if (code >= 51 && code <= 55) return 'cloud.drizzle.fill';
    if (code >= 61 && code <= 65) return 'cloud.rain.fill';
    if (code >= 71 && code <= 77) return 'cloud.snow.fill';
    if (code >= 80 && code <= 82) return 'cloud.rain.fill';
    if (code >= 85 && code <= 86) return 'cloud.snow.fill';
    if (code >= 95 && code <= 99) return 'cloud.bolt.fill';
    return 'questionmark.circle.fill';
  };

  const getWeatherColor = (code: number) => {
    if (code === 0 || code === 1) return '#FFD700'; // Sol - Amarillo
    if (code === 2) return '#87CEEB'; // Parcialmente nublado - Azul claro
    if (code === 3) return '#708090'; // Nublado - Gris
    if (code >= 45 && code <= 48) return '#D3D3D3'; // Niebla - Gris claro
    if (code >= 51 && code <= 55) return '#4682B4'; // Llovizna - Azul acero
    if (code >= 61 && code <= 65) return '#4169E1'; // Lluvia - Azul real
    if (code >= 71 && code <= 77) return '#F0F8FF'; // Nieve - Azul blanco
    if (code >= 80 && code <= 82) return '#1E90FF'; // Chubascos - Azul dodger
    if (code >= 85 && code <= 86) return '#E0E0E0'; // Chubascos de nieve - Gris claro
    if (code >= 95 && code <= 99) return '#8A2BE2'; // Tormenta - Azul violeta
    return colors.icon;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  const floatingStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scale.value,
      [1, 1.1],
      [0, -5]
    );
    
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, floatingStyle]}>
        <Animated.View style={animatedStyle}>
          <IconSymbol
            name={getWeatherIcon(weatherCode)}
            size={size}
            color={getWeatherColor(weatherCode)}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

