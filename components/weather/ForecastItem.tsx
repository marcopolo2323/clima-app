import { ThemedText } from '@/components/themed-text';
import { ModernCard } from '@/components/ui/ModernCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ForecastData } from '@/services/weatherService';
import { debugDateInfo, formatForecastDate } from '@/utils/dateUtils';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ForecastItemProps {
  forecast: ForecastData;
  isToday?: boolean;
  isTomorrow?: boolean;
}

export function ForecastItem({ forecast, isToday = false, isTomorrow = false }: ForecastItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDate = (dateString: string) => {
    // Debug: mostrar información de fechas
    debugDateInfo(dateString, 'Pronóstico');
    
    // Usar la función utilitaria para formatear la fecha
    return formatForecastDate(dateString, isToday, isTomorrow);
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return colors.weather.clear;
    if (temp < 10) return colors.weather.cloudy;
    if (temp < 20) return colors.weather.clear;
    if (temp < 30) return colors.weather.clear;
    return colors.warning;
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
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
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
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  todayDate: {
    color: '#87CEEB',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dateSubtext: {
    fontSize: 12,
    opacity: 0.9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  todayBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
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
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tempSeparator: {
    fontSize: 18,
    marginHorizontal: 4,
    opacity: 0.8,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  minTemp: {
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tempLabel: {
    fontSize: 12,
    opacity: 0.9,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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

