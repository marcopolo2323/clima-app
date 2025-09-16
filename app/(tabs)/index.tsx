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

const OPENCAGE_KEY = '96a6de4c85854c548ce4a9f21b902045'; // tu key OpenCage

export default function HomeScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const { location, loading: locationLoading, error: locationError, refreshLocation } = useLocation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (location) {
      getCityFromCoords(location.latitude, location.longitude);
    }
  }, [location]);

  const getCityFromCoords = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_KEY}&no_annotations=1&language=es`
      );
      const data = await response.json();
      if (data && data.results && data.results.length > 0) {
        const components = data.results[0].components;
        setLocationData({
          latitude: lat,
          longitude: lng,
          city: components.city || components.town || components.village || 'Ubicación desconocida',
          country: components.country || '',
        });
        await loadWeatherData(lat, lng);
      } else {
        setError('No se pudo obtener la ciudad desde las coordenadas');
      }
    } catch (err) {
      console.error('Error OpenCage:', err);
      setError('Error al obtener ciudad desde OpenCage');
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherData = async (lat?: number, lng?: number) => {
    if ((!lat || !lng) && locationData) {
      lat = locationData.latitude;
      lng = locationData.longitude;
    }
    if (!lat || !lng) return;

    try {
      setLoading(true);
      setError(null);

      const [currentWeather, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(lat, lng),
        WeatherService.getForecast(lat, lng, 5),
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
      await getCityFromCoords(location.latitude, location.longitude);
    }
    setRefreshing(false);
  };

  const handleLocationSelect = (newLocation: LocationData) => {
    setLocationData(newLocation);
    loadWeatherData(newLocation.latitude, newLocation.longitude);
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
        <ThemedText style={styles.errorMessage}>{locationError}</ThemedText>
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
        <TouchableOpacity style={styles.retryButton} onPress={handleLocationError}>
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {weather && locationData && (
        <WeatherCard
          weather={weather}
          city={locationData.city}
          country={locationData.country}
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
  container: { flex: 1 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  errorMessage: { fontSize: 16, textAlign: 'center', opacity: 0.7, marginBottom: 24 },
  retryButton: { backgroundColor: '#007BFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  forecastContainer: { marginTop: 8 },
  forecastHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  forecastTitle: { fontSize: 20, fontWeight: 'bold' },
  searchButton: { padding: 8, backgroundColor: 'rgba(0, 123, 255, 0.1)', borderRadius: 8 },
});
