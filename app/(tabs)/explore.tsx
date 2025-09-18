import { ThemedText } from '@/components/themed-text';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ModernCard } from '@/components/ui/ModernCard';
import { Colors } from '@/constants/theme';
import { useWeatherContext } from '@/contexts/WeatherContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ForecastData, WeatherData, WeatherService } from '@/services/weatherService';
import React, { useEffect, useState } from 'react';
import { AppState, ScrollView, StyleSheet, View } from 'react-native';

export default function ExploreScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { currentLocation } = useWeatherContext();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (currentLocation) {
      loadWeatherData();
    }
  }, [currentLocation]);

  // Escuchar cambios en la ubicación seleccionada desde el tab principal
  useEffect(() => {
    const handleLocationChange = () => {
      if (currentLocation) {
        loadWeatherData();
      }
    };

    // Re-cargar datos cuando la app vuelve a estar activa
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        handleLocationChange();
      }
    });

    return () => subscription?.remove();
  }, [currentLocation]);

  const loadWeatherData = async () => {
    if (!currentLocation) return;

    try {
      setLoading(true);
      setError(null);
      
      const [currentWeather, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(currentLocation.latitude, currentLocation.longitude),
        WeatherService.getForecast(currentLocation.latitude, currentLocation.longitude, 7)
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
      <GradientBackground variant="primary">
        <View style={styles.loadingContainer}>
          <IconSymbol name="cloud.sun.fill" size={60} color={colors.tint} />
          <ThemedText style={styles.loadingText}>Cargando información adicional...</ThemedText>
        </View>
      </GradientBackground>
    );
  }

  if (error) {
    return (
      <GradientBackground variant="primary">
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={60} color="#FF6B6B" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      </GradientBackground>
    );
  }

  if (!weather) {
    return (
      <GradientBackground variant="primary">
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>No hay datos del clima disponibles</ThemedText>
        </View>
      </GradientBackground>
    );
  }

  const tips = getWeatherTips(weather.weatherCode, weather.temperature);

  return (
    <GradientBackground variant="primary">
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <ModernCard 
          variant="elevated" 
          style={styles.header}
          padding="large"
          borderRadius="xl"
        >
          <View style={styles.headerContent}>
            <IconSymbol name="chart.bar.fill" size={32} color={colors.primary} />
            <View style={styles.headerText}>
              <ThemedText type="title" style={styles.title}>
                Información Detallada
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Datos meteorológicos y consejos personalizados
              </ThemedText>
            </View>
          </View>
        </ModernCard>

        {/* Consejos del clima */}
        <ModernCard 
          variant="elevated" 
          style={styles.section}
          padding="large"
          borderRadius="xl"
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="lightbulb.fill" size={28} color={colors.warning} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Consejos del Clima
            </ThemedText>
          </View>
          <View style={styles.tipsContainer}>
            {tips.map((tip, index) => (
              <ModernCard 
                key={index} 
                variant="filled" 
                style={styles.tipCard}
                padding="medium"
                borderRadius="medium"
              >
                <View style={styles.tipItem}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                  <ThemedText style={styles.tipText}>{tip}</ThemedText>
                </View>
              </ModernCard>
            ))}
          </View>
        </ModernCard>

        {/* Pronóstico extendido */}
        <ModernCard 
          variant="elevated" 
          style={styles.section}
          padding="large"
          borderRadius="xl"
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="calendar" size={28} color={colors.secondary} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Pronóstico 7 Días
            </ThemedText>
          </View>
          <View style={styles.forecastContainer}>
            {forecast.map((day, index) => {
              // Determinar si es hoy basándose en la fecha real
              const today = new Date();
              const todayDate = today.toISOString().split('T')[0];
              const forecastDate = day.date;
              const isToday = forecastDate === todayDate;
              
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              const tomorrowDate = tomorrow.toISOString().split('T')[0];
              const isTomorrow = forecastDate === tomorrowDate;
              
              const date = new Date(day.date);
              
              return (
                <ModernCard 
                  key={day.date} 
                  variant="filled" 
                  style={styles.forecastCard}
                  padding="medium"
                  borderRadius="large"
                >
                  <View style={styles.forecastRow}>
                    <View style={styles.forecastDate}>
                      <ThemedText style={styles.forecastDay}>
                        {isToday ? 'Hoy' : 
                         isTomorrow ? 'Mañana' : 
                         date.toLocaleDateString('es-ES', { weekday: 'short' })}
                      </ThemedText>
                      <ThemedText style={styles.forecastDateText}>
                        {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </ThemedText>
                    </View>
                    <View style={styles.forecastWeather}>
                      <IconSymbol name={day.icon} size={28} color={colors.icon} />
                      <ThemedText style={styles.forecastDescription}>{day.description}</ThemedText>
                    </View>
                    <View style={styles.forecastTemps}>
                      <ThemedText style={styles.forecastMax}>{day.maxTemp}°</ThemedText>
                      <ThemedText style={styles.forecastMin}>{day.minTemp}°</ThemedText>
                    </View>
                  </View>
                </ModernCard>
              );
            })}
          </View>
        </ModernCard>

        {/* Información técnica */}
        <ModernCard 
          variant="elevated" 
          style={styles.section}
          padding="large"
          borderRadius="xl"
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="info.circle.fill" size={28} color={colors.primary} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Información Técnica
            </ThemedText>
          </View>
          <View style={styles.techGrid}>
            <ModernCard variant="filled" style={styles.techCard} padding="medium" borderRadius="medium">
              <View style={styles.techItem}>
                <IconSymbol name="wind" size={24} color={colors.secondary} />
                <View style={styles.techContent}>
                  <ThemedText style={styles.techLabel}>Dirección del viento</ThemedText>
                  <ThemedText style={styles.techValue}>
                    {WeatherService.getWindDirection(weather.windDirection)} ({weather.windDirection}°)
                  </ThemedText>
                </View>
              </View>
            </ModernCard>

            <ModernCard variant="filled" style={styles.techCard} padding="medium" borderRadius="medium">
              <View style={styles.techItem}>
                <IconSymbol name="sun.max.fill" size={24} color={colors.warning} />
                <View style={styles.techContent}>
                  <ThemedText style={styles.techLabel}>Índice UV</ThemedText>
                  <ThemedText style={styles.techValue}>
                    {weather.uvIndex} - {WeatherService.getUVIndexDescription(weather.uvIndex)}
                  </ThemedText>
                </View>
              </View>
            </ModernCard>

            <ModernCard variant="filled" style={styles.techCard} padding="medium" borderRadius="medium">
              <View style={styles.techItem}>
                <IconSymbol name="barometer" size={24} color={colors.error} />
                <View style={styles.techContent}>
                  <ThemedText style={styles.techLabel}>Presión atmosférica</ThemedText>
                  <ThemedText style={styles.techValue}>{weather.pressure} hPa</ThemedText>
                </View>
              </View>
            </ModernCard>

            <ModernCard variant="filled" style={styles.techCard} padding="medium" borderRadius="medium">
              <View style={styles.techItem}>
                <IconSymbol name="eye.fill" size={24} color={colors.success} />
                <View style={styles.techContent}>
                  <ThemedText style={styles.techLabel}>Visibilidad</ThemedText>
                  <ThemedText style={styles.techValue}>{weather.visibility / 1000} km</ThemedText>
                </View>
              </View>
            </ModernCard>
          </View>
        </ModernCard>

        {/* Fuente de datos */}
        <ModernCard 
          variant="elevated" 
          style={styles.section}
          padding="large"
          borderRadius="xl"
        >
          <View style={styles.sectionHeader}>
            <IconSymbol name="link" size={28} color={colors.primary} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Fuente de Datos
            </ThemedText>
          </View>
          <View style={styles.sourceContainer}>
            <ThemedText style={styles.sourceText}>
              Los datos meteorológicos son proporcionados por Open-Meteo, una API gratuita y de código abierto.
            </ThemedText>
            <ThemedText style={styles.sourceText}>
              Los datos se actualizan cada hora y cubren todo el mundo con alta precisión.
            </ThemedText>
            <View style={styles.sourceBadge}>
              <IconSymbol name="checkmark.shield.fill" size={16} color={colors.success} />
              <ThemedText style={styles.sourceBadgeText}>Datos verificados</ThemedText>
            </View>
          </View>
        </ModernCard>

        {/* Espaciado inferior */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </GradientBackground>
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
    margin: 16,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    margin: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    marginBottom: 0,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  forecastContainer: {
    gap: 12,
  },
  forecastCard: {
    marginBottom: 0,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastDate: {
    flex: 1,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  forecastDateText: {
    fontSize: 12,
    opacity: 0.6,
  },
  forecastWeather: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  forecastDescription: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  forecastTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  forecastMax: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  forecastMin: {
    fontSize: 16,
    opacity: 0.7,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  techCard: {
    width: '48%',
    marginBottom: 0,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  techContent: {
    marginLeft: 12,
    flex: 1,
  },
  techLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
    fontWeight: '500',
  },
  techValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sourceContainer: {
    gap: 12,
  },
  sourceText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
    fontWeight: '500',
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  sourceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});
