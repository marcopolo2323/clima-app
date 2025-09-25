import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface DynamicElementsProps {
  weatherCode: number;
  temperature: number;
}

export function DynamicElements({ weatherCode, temperature }: DynamicElementsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const floatingElements = useSharedValue(0);
  const temperaturePulse = useSharedValue(1);
  const seasonalElements = useSharedValue(0);

  useEffect(() => {
    // Elementos flotantes sutiles
    floatingElements.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Pulso de temperatura
    temperaturePulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );

    // Elementos estacionales
    seasonalElements.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );
  }, [weatherCode, temperature]);

  const getSeasonalElements = () => {
    const month = new Date().getMonth();
    const isWinter = month >= 11 || month <= 2;
    const isSpring = month >= 3 && month <= 5;
    const isSummer = month >= 6 && month <= 8;
    const isAutumn = month >= 9 && month <= 10;

    if (isWinter) {
      return (
        <Animated.View style={[styles.seasonalContainer, { opacity: 0.3 }]}>
          {/* Copos de nieve sutiles */}
          {Array.from({ length: 8 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.snowflake,
                {
                  left: `${(index * 12.5) % 100}%`,
                  top: `${(index * 15) % 100}%`,
                  animationDelay: `${index * 200}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>
      );
    }

    if (isSpring) {
      return (
        <Animated.View style={[styles.seasonalContainer, { opacity: 0.2 }]}>
          {/* Pétalos de flores sutiles */}
          {Array.from({ length: 6 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.petal,
                {
                  left: `${(index * 16.67) % 100}%`,
                  top: `${(index * 20) % 100}%`,
                  animationDelay: `${index * 300}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>
      );
    }

    if (isSummer) {
      return (
        <Animated.View style={[styles.seasonalContainer, { opacity: 0.4 }]}>
          {/* Rayos de sol sutiles */}
          {Array.from({ length: 12 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.sunRay,
                {
                  transform: [{ rotate: `${index * 30}deg` }],
                  animationDelay: `${index * 100}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>
      );
    }

    if (isAutumn) {
      return (
        <Animated.View style={[styles.seasonalContainer, { opacity: 0.3 }]}>
          {/* Hojas de otoño sutiles */}
          {Array.from({ length: 10 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.leaf,
                {
                  left: `${(index * 10) % 100}%`,
                  top: `${(index * 12) % 100}%`,
                  animationDelay: `${index * 250}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>
      );
    }

    return null;
  };

  const getWeatherElements = () => {
    if (weatherCode >= 61 && weatherCode <= 65) {
      // Lluvia sutil
      return (
        <Animated.View style={[styles.weatherContainer, { opacity: 0.4 }]}>
          {Array.from({ length: 15 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.rainDrop,
                {
                  left: `${(index * 6.67) % 100}%`,
                  animationDelay: `${index * 150}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>
      );
    }

    if (weatherCode >= 71 && weatherCode <= 77) {
      // Nieve sutil
      return (
        <Animated.View style={[styles.weatherContainer, { opacity: 0.5 }]}>
          {Array.from({ length: 12 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.snowflake,
                {
                  left: `${(index * 8.33) % 100}%`,
                  top: `${(index * 10) % 100}%`,
                  animationDelay: `${index * 200}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>
      );
    }

    if (weatherCode >= 95 && weatherCode <= 99) {
      // Tormenta sutil
      return (
        <Animated.View style={[styles.weatherContainer, { opacity: 0.3 }]}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.lightning,
                {
                  left: `${(index * 12.5) % 100}%`,
                  top: `${(index * 15) % 100}%`,
                  animationDelay: `${index * 400}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>
      );
    }

    return null;
  };

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatingElements.value * 10 },
      { scale: 1 + floatingElements.value * 0.05 },
    ],
    opacity: 0.3 + floatingElements.value * 0.2,
  }));

  const temperatureStyle = useAnimatedStyle(() => ({
    transform: [{ scale: temperaturePulse.value }],
  }));

  const seasonalStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${seasonalElements.value * 360}deg` }],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Elementos estacionales */}
      <Animated.View style={[styles.seasonalWrapper, seasonalStyle]}>
        {getSeasonalElements()}
      </Animated.View>

      {/* Elementos del clima */}
      <Animated.View style={[styles.weatherWrapper, floatingStyle]}>
        {getWeatherElements()}
      </Animated.View>

      {/* Indicador de temperatura sutil */}
      <Animated.View style={[styles.temperatureIndicator, temperatureStyle]}>
        <View
          style={[
            styles.tempDot,
            {
              backgroundColor: temperature < 0 
                ? colors.weather.clear 
                : temperature < 20 
                ? colors.weather.cloudy 
                : colors.warning,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  seasonalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  weatherContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  seasonalWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  weatherWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  temperatureIndicator: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 10,
  },
  tempDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  // Elementos estacionales
  snowflake: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
  },
  petal: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 182, 193, 0.6)',
    borderRadius: 3,
  },
  sunRay: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    borderRadius: 1,
    top: 50,
    left: 50,
  },
  leaf: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 165, 0, 0.6)',
    borderRadius: 4,
  },
  // Elementos del clima
  rainDrop: {
    position: 'absolute',
    width: 1,
    height: 15,
    backgroundColor: 'rgba(135, 206, 235, 0.6)',
    borderRadius: 0.5,
    top: -15,
  },
  lightning: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 1,
  },
});
