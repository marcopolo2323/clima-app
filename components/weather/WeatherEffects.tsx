import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface WeatherEffectsProps {
  weatherCode: number;
}

export function WeatherEffects({ weatherCode }: WeatherEffectsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const rainOpacity = useSharedValue(0);
  const snowOpacity = useSharedValue(0);
  const sunRays = useSharedValue(0);
  const cloudMove = useSharedValue(0);

  useEffect(() => {
    // Efectos de lluvia
    if (weatherCode >= 61 && weatherCode <= 65) {
      rainOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      rainOpacity.value = withTiming(0, { duration: 500 });
    }

    // Efectos de nieve
    if (weatherCode >= 71 && weatherCode <= 77) {
      snowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 2000 }),
          withTiming(0.4, { duration: 2000 })
        ),
        -1,
        true
      );
    } else {
      snowOpacity.value = withTiming(0, { duration: 500 });
    }

    // Efectos de sol
    if (weatherCode === 0 || weatherCode === 1) {
      sunRays.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      sunRays.value = withTiming(0, { duration: 500 });
    }

    // Efectos de nubes
    if (weatherCode >= 2 && weatherCode <= 3) {
      cloudMove.value = withRepeat(
        withTiming(1, { duration: 8000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cloudMove.value = withTiming(0, { duration: 500 });
    }
  }, [weatherCode]);

  const rainStyle = useAnimatedStyle(() => ({
    opacity: rainOpacity.value,
  }));

  const snowStyle = useAnimatedStyle(() => ({
    opacity: snowOpacity.value,
  }));

  const sunRaysStyle = useAnimatedStyle(() => ({
    opacity: sunRays.value,
    transform: [{ rotate: `${sunRays.value * 360}deg` }],
  }));

  const cloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(cloudMove.value, [0, 1], [0, 50]) }],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Efectos de lluvia */}
      {weatherCode >= 61 && weatherCode <= 65 && (
        <Animated.View style={[styles.rainContainer, rainStyle]}>
          {Array.from({ length: 20 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.rainDrop,
                {
                  left: `${(index * 5) % 100}%`,
                  animationDelay: `${index * 100}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>
      )}

      {/* Efectos de nieve */}
      {weatherCode >= 71 && weatherCode <= 77 && (
        <Animated.View style={[styles.snowContainer, snowStyle]}>
          {Array.from({ length: 15 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.snowFlake,
                {
                  left: `${(index * 6.67) % 100}%`,
                  animationDelay: `${index * 200}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>
      )}

      {/* Efectos de sol */}
      {(weatherCode === 0 || weatherCode === 1) && (
        <Animated.View style={[styles.sunContainer, sunRaysStyle]}>
          <IconSymbol name="sun.max" size={100} color="rgba(255, 215, 0, 0.3)" />
        </Animated.View>
      )}

      {/* Efectos de nubes */}
      {weatherCode >= 2 && weatherCode <= 3 && (
        <Animated.View style={[styles.cloudContainer, cloudStyle]}>
          <IconSymbol name="cloud.fill" size={80} color="rgba(169, 169, 169, 0.4)" />
        </Animated.View>
      )}
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
  rainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(135, 206, 235, 0.6)',
    borderRadius: 1,
    top: -20,
    ...(Platform.OS === 'web' && {
      // @ts-ignore - CSS animation for web
      animation: 'rainFall 1s linear infinite',
    }),
  },
  snowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  snowFlake: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
    top: -10,
    ...(Platform.OS === 'web' && {
      // @ts-ignore - CSS animation for web
      animation: 'snowFall 2s linear infinite',
    }),
  },
  sunContainer: {
    position: 'absolute',
    top: 50,
    right: 50,
  },
  cloudContainer: {
    position: 'absolute',
    top: 100,
    left: -50,
  },
});
