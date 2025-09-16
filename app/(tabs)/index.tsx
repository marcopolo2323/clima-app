import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { ForecastItem } from '@/components/weather/ForecastItem';
import { LoadingWeather } from '@/components/weather/LoadingWeather';
import { CitySearch } from '@/components/weather/CitySearch';
import { WeatherService, WeatherData, ForecastData, LocationData } from '@/services/weatherService';
import { useLocation } from '@/hooks/useLocation';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { location, loading: locationLoading, error: locationError, refreshLocation } = useLocation();
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
        WeatherService.getForecast(location.latitude, location.longitude, 5)
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshLocation();
    if (location) {
      await loadWeatherData();
    }
    setRefreshing(false);
  };

  const handleLocationSelect = (newLocation: LocationData) => {
    // Actualizar la ubicación y recargar datos
    loadWeatherData();
  };

  const handleLocationError = () => {
    Alert.alert(
      'Error de Ubicación',
      'No se pudo obtener tu ubicación actual. Por favor, busca una ciudad manualmente.',
      [
        { text: 'Buscar Ciudad', onPress: () => setShowCitySearch(true) },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  if (locationError) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol name="location.slash" size={60} color="#FF6B6B" />
        <ThemedText style={styles.errorTitle}>Error de Ubicación</ThemedText>
        <ThemedText style={styles.errorMessage}>
          {locationError}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={handleLocationError}>
          <ThemedText style={styles.retryButtonText}>Buscar Ciudad</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (locationLoading || loading) {
    return <LoadingWeather message="Obteniendo tu ubicación y datos del clima..." />;
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.triangle" size={60} color="#FF6B6B" />
        <ThemedText style={styles.errorTitle}>Error</ThemedText>
        <ThemedText style={styles.errorMessage}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadWeatherData}>
          <ThemedText style={styles.retryButtonText}>Reintentar</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (showCitySearch) {
    return (
      <CitySearch
        onLocationSelect={handleLocationSelect}
        onClose={() => setShowCitySearch(false)}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {weather && location && (
        <WeatherCard
          weather={weather}
          city={location.city || 'Ubicación desconocida'}
          country={location.country}
        />
      )}

      <ThemedView style={styles.forecastContainer}>
        <View style={styles.forecastHeader}>
          <ThemedText type="subtitle" style={styles.forecastTitle}>
            Pronóstico 5 Días
          </ThemedText>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setShowCitySearch(true)}
          >
            <IconSymbol name="magnifyingglass" size={20} color={colors.tint} />
          </TouchableOpacity>
        </View>

        {forecast.map((day, index) => (
          <ForecastItem
            key={day.date}
            forecast={day}
            isToday={index === 0}
          />
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forecastContainer: {
    marginTop: 8,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: 8,
  },
});
