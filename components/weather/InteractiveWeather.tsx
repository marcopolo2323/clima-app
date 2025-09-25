import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface InteractiveWeatherProps {
  weatherCode: number;
  temperature: number;
  onWeatherTap?: () => void;
}

export function InteractiveWeather({ weatherCode, temperature, onWeatherTap }: InteractiveWeatherProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isPressed, setIsPressed] = useState(false);

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const bounce = useSharedValue(0);
  const particles = useSharedValue(0);

  useEffect(() => {
    // Animación de respiración sutil
    scale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Rotación lenta
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );

    // Efectos específicos por clima
    if (weatherCode >= 61 && weatherCode <= 65) {
      // Lluvia - crear partículas de lluvia
      particles.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      // Nieve - crear partículas de nieve
      particles.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      // Tormenta - efecto de rayo
      bounce.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 100 }),
          withTiming(0, { duration: 200 }),
          withDelay(1000, withTiming(1, { duration: 50 })),
          withTiming(0, { duration: 100 })
        ),
        -1,
        false
      );
    }
  }, [weatherCode, temperature]);

  const handlePress = () => {
    setIsPressed(true);
    
    // Animación de toque
    scale.value = withSequence(
      withSpring(0.95, { damping: 10, stiffness: 200 }),
      withSpring(1.05, { damping: 8, stiffness: 150 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );

    // Efecto de partículas al tocar
    particles.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );

    setTimeout(() => setIsPressed(false), 200);
    onWeatherTap?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + bounce.value * 0.1 }],
    opacity: bounce.value,
  }));

  const particlesStyle = useAnimatedStyle(() => ({
    opacity: particles.value,
  }));

  const getWeatherParticles = () => {
    if (weatherCode >= 61 && weatherCode <= 65) {
      // Partículas de lluvia
      return Array.from({ length: 20 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.rainParticle,
            {
              left: `${(index * 5) % 100}%`,
              animationDelay: `${index * 50}ms`,
            },
          ]}
        />
      ));
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      // Partículas de nieve
      return Array.from({ length: 15 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.snowParticle,
            {
              left: `${(index * 6.67) % 100}%`,
              animationDelay: `${index * 100}ms`,
            },
          ]}
        />
      ));
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      // Efectos de rayo
      return Array.from({ length: 5 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.lightningParticle,
            {
              left: `${(index * 20) % 100}%`,
              animationDelay: `${index * 200}ms`,
            },
          ]}
        />
      ));
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Animated.View style={[styles.weatherContainer, animatedStyle]}>
        {/* Efectos de partículas */}
        <Animated.View style={[styles.particlesContainer, particlesStyle]}>
          {getWeatherParticles()}
        </Animated.View>

        {/* Efecto de rayo para tormenta */}
        {weatherCode >= 95 && weatherCode <= 99 && (
          <Animated.View style={[styles.lightningContainer, bounceStyle]}>
            <View style={styles.lightning} />
          </Animated.View>
        )}

        {/* Indicador de temperatura interactivo */}
        <Animated.View style={[styles.temperatureIndicator, animatedStyle]}>
          <View
            style={[
              styles.tempCircle,
              {
                backgroundColor: temperature < 0 
                  ? colors.weather.clear 
                  : temperature < 20 
                  ? colors.weather.cloudy 
                  : colors.warning,
              },
            ]}
          />
          <ThemedText style={styles.tempText}>
            {temperature}°
          </ThemedText>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  weatherContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  rainParticle: {
    position: 'absolute',
    width: 1,
    height: 20,
    backgroundColor: 'rgba(135, 206, 235, 0.6)',
    borderRadius: 0.5,
    top: -20,
  },
  snowParticle: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1.5,
    top: -10,
  },
  lightningParticle: {
    position: 'absolute',
    width: 2,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 1,
    top: -30,
  },
  lightningContainer: {
    position: 'absolute',
    top: 50,
    right: 50,
  },
  lightning: {
    width: 3,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1.5,
  },
  temperatureIndicator: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  tempCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tempText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
