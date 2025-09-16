import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ForecastData } from '@/services/weatherService';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ForecastItemProps {
  forecast: ForecastData;
  isToday?: boolean;
}

export function ForecastItem({ forecast, isToday = false }: ForecastItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (isToday) {
      return 'Hoy';
    }

    if (date.toDateString() === tomorrow.toDateString()) {
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

  return (
    <ThemedView style={[styles.container, isToday && styles.todayContainer]}>
      <View style={styles.dateContainer}>
        <ThemedText style={[styles.date, isToday && styles.todayDate]}>
          {formatDate(forecast.date)}
        </ThemedText>
      </View>

      <View style={styles.weatherContainer}>
        <IconSymbol
          name={forecast.icon}
          size={32}
          color={getTemperatureColor((forecast.maxTemp + forecast.minTemp) / 2)}
          style={styles.weatherIcon}
        />
        <ThemedText style={styles.description}>
          {forecast.description}
        </ThemedText>
      </View>

      <View style={styles.temperatureContainer}>
        <ThemedText style={[styles.maxTemp, { color: getTemperatureColor(forecast.maxTemp) }]}>
          {forecast.maxTemp}°
        </ThemedText>
        <ThemedText style={[styles.minTemp, { color: getTemperatureColor(forecast.minTemp) }]}>
          {forecast.minTemp}°
        </ThemedText>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <IconSymbol name="cloud.rain.fill" size={14} color={colors.icon} />
          <ThemedText style={styles.detailText}>
            {forecast.precipitation}mm
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <IconSymbol name="wind" size={14} color={colors.icon} />
          <ThemedText style={styles.detailText}>
            {forecast.windSpeed} km/h
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  todayContainer: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 255, 0.3)',
  },
  dateContainer: {
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayDate: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherIcon: {
    marginRight: 12,
  },
  description: {
    fontSize: 14,
    flex: 1,
    opacity: 0.8,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  maxTemp: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  minTemp: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.7,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.7,
  },
});

