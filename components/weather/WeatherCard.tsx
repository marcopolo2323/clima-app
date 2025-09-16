import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WeatherData } from '@/services/weatherService';
import { WeatherService } from '@/services/weatherService';
import { WeatherAnimation } from './WeatherAnimation';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

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

  return (
    <ThemedView style={styles.container}>
      {/* Header con ubicación */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.cityName}>
          {city}
        </ThemedText>
        {country && (
          <ThemedText style={styles.countryName}>
            {country}
          </ThemedText>
        )}
      </View>

      {/* Temperatura principal */}
      <View style={styles.temperatureContainer}>
        <WeatherAnimation
          weatherCode={weather.weatherCode}
          size={80}
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

      {/* Detalles del clima */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <IconSymbol name="humidity.fill" size={20} color={colors.icon} />
            <ThemedText style={styles.detailLabel}>Humedad</ThemedText>
            <ThemedText style={styles.detailValue}>{weather.humidity}%</ThemedText>
          </View>
          
          <View style={styles.detailItem}>
            <IconSymbol name="wind" size={20} color={colors.icon} />
            <ThemedText style={styles.detailLabel}>Viento</ThemedText>
            <ThemedText style={styles.detailValue}>
              {weather.windSpeed} km/h {WeatherService.getWindDirection(weather.windDirection)}
            </ThemedText>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <IconSymbol name="barometer" size={20} color={colors.icon} />
            <ThemedText style={styles.detailLabel}>Presión</ThemedText>
            <ThemedText style={styles.detailValue}>{weather.pressure} hPa</ThemedText>
          </View>
          
          <View style={styles.detailItem}>
            <IconSymbol name="eye.fill" size={20} color={colors.icon} />
            <ThemedText style={styles.detailLabel}>Visibilidad</ThemedText>
            <ThemedText style={styles.detailValue}>{weather.visibility / 1000} km</ThemedText>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <IconSymbol name="sun.max.fill" size={20} color={colors.icon} />
            <ThemedText style={styles.detailLabel}>Índice UV</ThemedText>
            <ThemedText style={styles.detailValue}>
              {weather.uvIndex} ({WeatherService.getUVIndexDescription(weather.uvIndex)})
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countryName: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  weatherIcon: {
    marginRight: 20,
  },
  temperatureInfo: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
