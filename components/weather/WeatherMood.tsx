import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface WeatherMoodProps {
  weatherCode: number;
  temperature: number;
  description: string;
}

export function WeatherMood({ weatherCode, temperature, description }: WeatherMoodProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [mood, setMood] = useState<string>('');
  const [moodEmoji, setMoodEmoji] = useState<string>('');

  const moodPulse = useSharedValue(1);
  const moodFloat = useSharedValue(0);
  const moodGlow = useSharedValue(0);

  useEffect(() => {
    // Determinar el estado de ánimo basado en el clima y temperatura
    let newMood = '';
    let newEmoji = '';

    if (weatherCode === 0 || weatherCode === 1) {
      if (temperature > 25) {
        newMood = '¡Día perfecto para disfrutar!';
        newEmoji = '☀️';
      } else if (temperature > 15) {
        newMood = '¡Excelente día soleado!';
        newEmoji = '🌤️';
      } else {
        newMood = '¡Día despejado y fresco!';
        newEmoji = '🌅';
      }
    } else if (weatherCode === 2) {
      newMood = '¡Parcialmente nublado, ideal para caminar!';
      newEmoji = '⛅';
    } else if (weatherCode === 3) {
      newMood = '¡Día nublado perfecto para relajarse!';
      newEmoji = '☁️';
    } else if (weatherCode >= 61 && weatherCode <= 65) {
      if (temperature > 20) {
        newMood = '¡Lluvia refrescante!';
        newEmoji = '🌧️';
      } else {
        newMood = '¡Lluvia suave y relajante!';
        newEmoji = '🌦️';
      }
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      newMood = '¡Día de nieve mágico!';
      newEmoji = '❄️';
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      newMood = '¡Tormenta emocionante!';
      newEmoji = '⛈️';
    } else if (weatherCode === 45 || weatherCode === 48) {
      newMood = '¡Niebla misteriosa!';
      newEmoji = '🌫️';
    } else {
      newMood = '¡Día especial!';
      newEmoji = '🌍';
    }

    setMood(newMood);
    setMoodEmoji(newEmoji);

    // Animaciones del estado de ánimo
    moodPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    moodFloat.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    moodGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [weatherCode, temperature, description]);

  const getMoodColor = () => {
    if (weatherCode === 0 || weatherCode === 1) {
      return colors.weather.clear;
    } else if (weatherCode >= 61 && weatherCode <= 65) {
      return colors.weather.rain;
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      return colors.weather.snow;
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      return colors.weather.storm;
    } else {
      return colors.weather.cloudy;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: moodPulse.value },
      { translateY: moodFloat.value * 5 },
    ],
    opacity: 0.8 + moodGlow.value * 0.2,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: moodGlow.value * 0.3,
    transform: [{ scale: 1 + moodGlow.value * 0.1 }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Animated.View style={[styles.glowEffect, glowStyle]} />
      
      <View style={[styles.moodCard, { borderColor: getMoodColor() }]}>
        <View style={styles.moodContent}>
          <ThemedText style={styles.moodEmoji}>
            {moodEmoji}
          </ThemedText>
          <ThemedText style={[styles.moodText, { color: getMoodColor() }]}>
            {mood}
          </ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  moodCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  moodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
