import { ThemedText } from '@/components/themed-text';
import { ModernCard } from '@/components/ui/ModernCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WeatherData } from '@/services/weatherService';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { SmartBackground } from './SmartBackground';
import { WeatherAnimation } from './WeatherAnimation';
import { WeatherEffects } from './WeatherEffects';

const { width } = Dimensions.get('window');

interface WeatherCardProps {
  weather: WeatherData;
  city: string;
  country?: string;
}

export function WeatherCard({ weather, city, country }: WeatherCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return colors.weather.clear; // Azul frío
    if (temp < 10) return colors.weather.cloudy; // Azul claro
    if (temp < 20) return colors.weather.clear; // Verde claro
    if (temp < 30) return colors.weather.clear; // Amarillo
    return colors.warning; // Rojo caliente
  };

  const getUVColor = (uvIndex: number) => {
    if (uvIndex <= 2) return colors.success;
    if (uvIndex <= 5) return colors.warning;
    if (uvIndex <= 7) return colors.warning;
    if (uvIndex <= 10) return colors.error;
    return colors.error;
  };

  const handleWeatherTap = () => {
    // Efecto de toque en el clima
    console.log('🌤️ Clima tocado!', weather.description);
  };

  return (
    <SmartBackground weatherCode={weather.weatherCode} temperature={weather.temperature}>
      <WeatherEffects weatherCode={weather.weatherCode} windSpeed={weather.windSpeed} />
      <ModernCard variant="elevated" style={styles.container} padding="large" borderRadius="xl">
        <View style={styles.cleanHeader}>
          <ThemedText type="title" style={styles.cityCentered} numberOfLines={1}>{city}</ThemedText>
          {country && (
            <ThemedText style={styles.countryCentered} numberOfLines={1}>{country}</ThemedText>
          )}
        </View>

        <View style={styles.centerBlock}>
        <WeatherAnimation weatherCode={weather.weatherCode} size={80} />
        <ThemedText type="title" style={[styles.bigTemp, { color: getTemperatureColor(weather.temperature) }]}>
          {weather.temperature}°
        </ThemedText>
          <ThemedText style={styles.subLine}>
            {Math.round(weather.temperature + 5)}° / {Math.round(weather.temperature - 5)}° · {weather.description}
          </ThemedText>
          {weather.feelsLike !== undefined && (
            <ThemedText style={styles.metaLine}>Sensación {weather.feelsLike}°</ThemedText>
          )}
        </View>
      </ModernCard>
    </SmartBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    minHeight: 400,
  },
  cleanHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  cityCentered: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  countryCentered: {
    fontSize: 13,
    opacity: 0.9,
    color: '#FFFFFF',
  },
  centerBlock: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 20,
  },
  bigTemp: {
    fontSize: 68,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    lineHeight: 80,
  },
  subLine: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
  },
  metaLine: {
    marginTop: 4,
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
