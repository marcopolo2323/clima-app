import { ThemedText } from '@/components/themed-text';
import { ModernCard } from '@/components/ui/ModernCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ForecastData } from '@/services/weatherService';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ForecastItemProps {
  forecast: ForecastData;
  isToday?: boolean;
}

export function ForecastItem({ forecast, isToday = false }: ForecastItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDate = (dateString: string) => {
    // Crear fecha en zona horaria local
    const date = new Date(dateString);
    const today = new Date();
    
    // Obtener solo la parte de la fecha (sin hora)
    const todayDate = today.toISOString().split('T')[0];
    const forecastDate = date.toISOString().split('T')[0];
    
    // Calcular mañana
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    if (isToday || forecastDate === todayDate) {
      return 'Hoy';
    }

    if (forecastDate === tomorrowDate) {
      return 'Mañana';
    }

    return date.toLocaleDateString('es-ES', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return '#4A90E2';
    if (temp < 10) return '#87CEEB';
    if (temp < 20) return '#98FB98';
    if (temp < 30) return '#FFD700';
    return '#FF6347';
  };

  const getPrecipitationColor = (precip: number) => {
    if (precip === 0) return colors.success;
    if (precip < 5) return colors.warning;
    return colors.error;
  };

  return (
    <TouchableOpacity activeOpacity={0.7}>
      <ModernCard 
        variant={isToday ? 'elevated' : 'filled'}
        style={[styles.container, isToday && styles.todayContainer]}
        padding="medium"
        borderRadius="large"
      >
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <ThemedText style={[styles.date, isToday && styles.todayDate]}>
              {formatDate(forecast.date)}
            </ThemedText>
            <ThemedText style={styles.dateSubtext}>
              {new Date(forecast.date).toLocaleDateString('es-ES', { 
                day: 'numeric',
                month: 'short'
              })}
            </ThemedText>
          </View>
          
          {isToday && (
            <View style={styles.todayBadge}>
              <ThemedText style={styles.todayBadgeText}>HOY</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.weatherSection}>
          <View style={styles.weatherInfo}>
            <IconSymbol
              name={forecast.icon}
              size={40}
              color={getTemperatureColor((forecast.maxTemp + forecast.minTemp) / 2)}
              style={styles.weatherIcon}
            />
            <View style={styles.weatherText}>
              <ThemedText style={styles.description}>
                {forecast.description}
              </ThemedText>
              <View style={styles.weatherDetails}>
                <View style={styles.detailItem}>
                  <IconSymbol name="cloud.rain.fill" size={12} color={getPrecipitationColor(forecast.precipitation)} />
                  <ThemedText style={[styles.detailText, { color: getPrecipitationColor(forecast.precipitation) }]}>
                    {forecast.precipitation}mm
                  </ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <IconSymbol name="wind" size={12} color={colors.icon} />
                  <ThemedText style={styles.detailText}>
                    {forecast.windSpeed} km/h
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.temperatureSection}>
            <View style={styles.temperatureMain}>
              <ThemedText style={[styles.maxTemp, { color: getTemperatureColor(forecast.maxTemp) }]}>
                {forecast.maxTemp}°
              </ThemedText>
              <ThemedText style={styles.tempSeparator}>/</ThemedText>
              <ThemedText style={[styles.minTemp, { color: getTemperatureColor(forecast.minTemp) }]}>
                {forecast.minTemp}°
              </ThemedText>
            </View>
            <ThemedText style={styles.tempLabel}>
              {forecast.maxTemp}° / {forecast.minTemp}°
            </ThemedText>
          </View>
        </View>

        {/* Barra de progreso de temperatura */}
        <View style={styles.tempBarContainer}>
          <View style={styles.tempBar}>
            <View 
              style={[
                styles.tempBarFill,
                { 
                  width: `${Math.min(Math.max((forecast.maxTemp + 20) / 60 * 100, 0), 100)}%`,
                  backgroundColor: getTemperatureColor(forecast.maxTemp)
                }
              ]} 
            />
          </View>
        </View>
      </ModernCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  todayContainer: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  todayDate: {
    color: '#007AFF',
  },
  dateSubtext: {
    fontSize: 12,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  todayBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  weatherSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weatherIcon: {
    marginRight: 12,
  },
  weatherText: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  weatherDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  temperatureSection: {
    alignItems: 'flex-end',
  },
  temperatureMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  maxTemp: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tempSeparator: {
    fontSize: 18,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  minTemp: {
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.7,
  },
  tempLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  tempBarContainer: {
    marginTop: 8,
  },
  tempBar: {
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
  },
  tempBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});

