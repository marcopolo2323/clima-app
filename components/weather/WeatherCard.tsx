import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ModernCard } from '@/components/ui/ModernCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WeatherData } from '@/services/weatherService';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { WeatherAnimation } from './WeatherAnimation';
import { WeatherBackground } from './WeatherBackground';
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
    if (temp < 0) return '#4A90E2'; // Azul frío
    if (temp < 10) return '#87CEEB'; // Azul claro
    if (temp < 20) return '#98FB98'; // Verde claro
    if (temp < 30) return '#FFD700'; // Amarillo
    return '#FF6347'; // Rojo caliente
  };

  const getUVColor = (uvIndex: number) => {
    if (uvIndex <= 2) return colors.success;
    if (uvIndex <= 5) return colors.warning;
    if (uvIndex <= 7) return '#FF6B35';
    if (uvIndex <= 10) return '#FF3B30';
    return colors.error;
  };

  return (
    <WeatherBackground weatherCode={weather.weatherCode}>
      <WeatherEffects weatherCode={weather.weatherCode} />
      <ModernCard 
        variant="elevated" 
        style={styles.container}
        padding="large"
        borderRadius="xl"
      >
        {/* Header con ubicación */}
        <View style={styles.header}>
          <View style={styles.locationInfo}>
            <IconSymbol name="location.fill" size={20} color={colors.primary} />
            <View style={styles.locationText}>
              <ThemedText type="title" style={styles.cityName} numberOfLines={1}>
                {city}
              </ThemedText>
              {country && (
                <ThemedText style={styles.countryName} numberOfLines={1}>
                  {country}
                </ThemedText>
              )}
            </View>
          </View>
        </View>

        {/* Temperatura principal */}
        <View style={styles.temperatureSection}>
          <View style={styles.temperatureMain}>
            <WeatherAnimation
              weatherCode={weather.weatherCode}
              size={100}
            />
            <View style={styles.temperatureInfo}>
              <ThemedText type="title" style={[styles.temperature, { color: getTemperatureColor(weather.temperature) }]}>
                {weather.temperature}°
              </ThemedText>
              <ThemedText style={styles.description}>
                {weather.description}
              </ThemedText>
            </View>
          </View>
          
          {/* Sensación térmica y otros datos rápidos */}
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <ThemedText style={styles.quickStatLabel}>Sensación</ThemedText>
              <ThemedText style={[styles.quickStatValue, { color: getTemperatureColor(weather.temperature) }]}>
                {weather.temperature}°
              </ThemedText>
            </View>
            <View style={styles.quickStatItem}>
              <ThemedText style={styles.quickStatLabel}>Humedad</ThemedText>
              <ThemedText style={styles.quickStatValue}>{weather.humidity}%</ThemedText>
            </View>
            <View style={styles.quickStatItem}>
              <ThemedText style={styles.quickStatLabel}>Viento</ThemedText>
              <ThemedText style={styles.quickStatValue}>{weather.windSpeed} km/h</ThemedText>
            </View>
          </View>
        </View>

        {/* Detalles del clima en tarjetas circulares */}
        <View style={styles.detailsGrid}>
          <View style={styles.circularCard}>
            <IconSymbol name="humidity.fill" size={28} color={colors.primary} />
            <ThemedText style={styles.circularValue}>{weather.humidity}%</ThemedText>
            <ThemedText style={styles.circularLabel}>Humedad</ThemedText>
          </View>

          <View style={styles.circularCard}>
            <IconSymbol name="wind" size={28} color={colors.secondary} />
            <ThemedText style={styles.circularValue}>{weather.windSpeed}</ThemedText>
            <ThemedText style={styles.circularLabel}>km/h</ThemedText>
          </View>

          <View style={styles.circularCard}>
            <IconSymbol name="barometer" size={28} color={colors.warning} />
            <ThemedText style={styles.circularValue}>{weather.pressure}</ThemedText>
            <ThemedText style={styles.circularLabel}>hPa</ThemedText>
          </View>

          <View style={styles.circularCard}>
            <IconSymbol name="sun.max.fill" size={28} color={getUVColor(weather.uvIndex)} />
            <ThemedText style={[styles.circularValue, { color: getUVColor(weather.uvIndex) }]}>
              {weather.uvIndex}
            </ThemedText>
            <ThemedText style={styles.circularLabel}>UV</ThemedText>
          </View>

          <View style={styles.circularCard}>
            <IconSymbol name="eye.fill" size={28} color={colors.success} />
            <ThemedText style={styles.circularValue}>{weather.visibility / 1000}</ThemedText>
            <ThemedText style={styles.circularLabel}>km</ThemedText>
          </View>

          <View style={styles.circularCard}>
            <IconSymbol name="thermometer" size={28} color={getTemperatureColor(weather.temperature)} />
            <ThemedText style={[styles.circularValue, { color: getTemperatureColor(weather.temperature) }]}>
              {weather.temperature}°
            </ThemedText>
            <ThemedText style={styles.circularLabel}>Temp</ThemedText>
          </View>
        </View>
      </ModernCard>
    </WeatherBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    minHeight: 400,
  },
  header: {
    marginBottom: 24,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    flex: 1,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  countryName: {
    fontSize: 14,
    opacity: 0.9,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  temperatureSection: {
    marginBottom: 24,
  },
  temperatureMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  temperatureInfo: {
    alignItems: 'center',
    marginLeft: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 4,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
  },
  circularCard: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  circularValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  circularLabel: {
    fontSize: 10,
    opacity: 0.9,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
