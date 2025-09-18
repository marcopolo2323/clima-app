import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface WeatherAnimationProps {
  weatherCode: number;
  size?: number;
}

export function WeatherAnimation({ weatherCode, size = 100 }: WeatherAnimationProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const rotation = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const pulse = useSharedValue(1);

  useEffect(() => {
    // Animación de entrada
    scale.value = withTiming(1, { 
      duration: 800, 
      easing: Easing.out(Easing.back(1.2)) 
    });
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600 });

    // Animaciones específicas por tipo de clima
    if (weatherCode >= 61 && weatherCode <= 65) { // Lluvia
      rotation.value = withRepeat(
        withTiming(360, { 
          duration: 3000,
          easing: Easing.linear 
        }),
        -1,
        false
      );
      
      // Efecto de gotas de lluvia
      translateY.value = withRepeat(
        withSequence(
          withTiming(5, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        true
      );
    }

    // Tormenta con efectos dramáticos
    if (weatherCode >= 95 && weatherCode <= 99) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 200 }),
          withTiming(1, { duration: 200 }),
          withDelay(1000, withTiming(1.1, { duration: 200 })),
          withTiming(1, { duration: 200 })
        ),
        -1,
        true
      );
      
      // Efecto de parpadeo
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 100 }),
          withTiming(1, { duration: 100 }),
          withDelay(500, withTiming(0.8, { duration: 50 })),
          withTiming(1, { duration: 50 })
        ),
        -1,
        true
      );
    }

    // Niebla con efecto de desvanecimiento
    if (weatherCode === 45 || weatherCode === 48) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
      
      // Movimiento sutil
      translateY.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 3000 }),
          withTiming(3, { duration: 3000 })
        ),
        -1,
        true
      );
    }

    // Sol con efecto de pulso
    if (weatherCode === 0 || weatherCode === 1) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    }

    // Nieve con movimiento flotante
    if (weatherCode >= 71 && weatherCode <= 77) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 2000 }),
          withTiming(5, { duration: 2000 })
        ),
        -1,
        true
      );
      
      rotation.value = withRepeat(
        withTiming(10, { duration: 4000 }),
        -1,
        true
      );
    }

    // Animación general de respiración
    if (weatherCode !== 0 && weatherCode !== 1 && weatherCode < 61) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 3000 }),
          withTiming(1, { duration: 3000 })
        ),
        -1,
        true
      );
    }

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
        { scale: scale.value * pulse.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(
      pulse.value,
      [1, 1.1],
      [0.3, 0.6]
    );
    
    return {
      opacity: glowOpacity,
      transform: [{ scale: pulse.value * 1.2 }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Efecto de resplandor para el sol */}
      {(weatherCode === 0 || weatherCode === 1) && (
        <Animated.View style={[styles.glowEffect, glowStyle]}>
          <IconSymbol
            name="sun.max.fill"
            size={size * 1.5}
            color={getWeatherColor(weatherCode)}
          />
        </Animated.View>
      )}
      
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <IconSymbol
          name={getWeatherIcon(weatherCode)}
          size={size}
          color={getWeatherColor(weatherCode)}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  glowEffect: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

