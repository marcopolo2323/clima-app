import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WeatherService, WeatherData, ForecastData } from '@/services/weatherService';
import { useLocation } from '@/hooks/useLocation';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ExploreScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { location } = useLocation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (location) {
      loadWeatherData();
    }
  }, [location]);

  const loadWeatherData = async () => {
    if (!location) return;

    try {
      setLoading(true);
      setError(null);
      
      const [currentWeather, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(location.latitude, location.longitude),
        WeatherService.getForecast(location.latitude, location.longitude, 7)
      ]);

      setWeather(currentWeather);
      setForecast(forecastData);
    } catch (err) {
      console.error('Error loading weather data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos del clima');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherTips = (weatherCode: number, temperature: number) => {
    const tips = [];
    
    if (temperature < 5) {
      tips.push('Usa ropa muy abrigada y evita salir si no es necesario');
    } else if (temperature < 15) {
      tips.push('Lleva una chaqueta y ropa de abrigo');
    } else if (temperature > 30) {
      tips.push('Usa ropa ligera, protector solar y mantente hidratado');
    }

    if (weatherCode >= 61 && weatherCode <= 65) {
      tips.push('Lleva paraguas y ropa impermeable');
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      tips.push('Ten cuidado con el hielo en las calles');
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      tips.push('Evita actividades al aire libre durante tormentas');
    }

    return tips;
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <IconSymbol name="cloud.sun.fill" size={60} color={colors.tint} />
        <ThemedText style={styles.loadingText}>Cargando información adicional...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.triangle" size={60} color="#FF6B6B" />
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (!weather) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>No hay datos del clima disponibles</ThemedText>
      </ThemedView>
    );
  }

  const tips = getWeatherTips(weather.weatherCode, weather.temperature);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Información Detallada
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Datos meteorológicos y consejos
        </ThemedText>
      </ThemedView>

      {/* Consejos del clima */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="lightbulb.fill" size={24} color={colors.tint} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Consejos del Clima
          </ThemedText>
        </View>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <IconSymbol name="checkmark.circle.fill" size={16} color="#4CAF50" />
            <ThemedText style={styles.tipText}>{tip}</ThemedText>
          </View>
        ))}
      </ThemedView>

      {/* Pronóstico extendido */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="calendar" size={24} color={colors.tint} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Pronóstico 7 Días
          </ThemedText>
        </View>
        {forecast.map((day, index) => (
          <View key={day.date} style={styles.forecastRow}>
            <View style={styles.forecastDate}>
              <ThemedText style={styles.forecastDay}>
                {index === 0 ? 'Hoy' : 
                 index === 1 ? 'Mañana' : 
                 new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' })}
              </ThemedText>
              <ThemedText style={styles.forecastDateText}>
                {new Date(day.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </ThemedText>
            </View>
            <View style={styles.forecastWeather}>
              <IconSymbol name={day.icon} size={24} color={colors.icon} />
              <ThemedText style={styles.forecastDescription}>{day.description}</ThemedText>
            </View>
            <View style={styles.forecastTemps}>
              <ThemedText style={styles.forecastMax}>{day.maxTemp}°</ThemedText>
              <ThemedText style={styles.forecastMin}>{day.minTemp}°</ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>

      {/* Información técnica */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.tint} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Información Técnica
          </ThemedText>
        </View>
        <View style={styles.techInfo}>
          <View style={styles.techItem}>
            <ThemedText style={styles.techLabel}>Dirección del viento</ThemedText>
            <ThemedText style={styles.techValue}>
              {WeatherService.getWindDirection(weather.windDirection)} ({weather.windDirection}°)
            </ThemedText>
          </View>
          <View style={styles.techItem}>
            <ThemedText style={styles.techLabel}>Índice UV</ThemedText>
            <ThemedText style={styles.techValue}>
              {weather.uvIndex} - {WeatherService.getUVIndexDescription(weather.uvIndex)}
            </ThemedText>
          </View>
          <View style={styles.techItem}>
            <ThemedText style={styles.techLabel}>Presión atmosférica</ThemedText>
            <ThemedText style={styles.techValue}>{weather.pressure} hPa</ThemedText>
          </View>
          <View style={styles.techItem}>
            <ThemedText style={styles.techLabel}>Visibilidad</ThemedText>
            <ThemedText style={styles.techValue}>{weather.visibility / 1000} km</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Fuente de datos */}
      <ThemedView style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol name="link" size={24} color={colors.tint} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Fuente de Datos
          </ThemedText>
        </View>
        <ThemedText style={styles.sourceText}>
          Los datos meteorológicos son proporcionados por Open-Meteo, una API gratuita y de código abierto.
        </ThemedText>
        <ThemedText style={styles.sourceText}>
          Los datos se actualizan cada hora y cubren todo el mundo con alta precisión.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  forecastDate: {
    flex: 1,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: '600',
  },
  forecastDateText: {
    fontSize: 12,
    opacity: 0.7,
  },
  forecastWeather: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastDescription: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  forecastTemps: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastMax: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  forecastMin: {
    fontSize: 14,
    opacity: 0.7,
  },
  techInfo: {
    gap: 12,
  },
  techItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  techLabel: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  techValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  sourceText: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 8,
  },
});
