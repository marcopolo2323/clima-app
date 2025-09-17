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
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Estado para manejar la ubicación seleccionada (puede ser diferente a la ubicación del GPS)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  
  const { location: deviceLocation, loading: locationLoading, error: locationError, refreshLocation } = useLocation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // La ubicación actual es la seleccionada manualmente o la del dispositivo
  const currentLocation = selectedLocation || deviceLocation;

  useEffect(() => {
    if (currentLocation) {
      loadWeatherData(currentLocation);
    }
  }, [currentLocation]);

  const loadWeatherData = async (location: LocationData) => {
    if (!location) return;

    try {
      setLoading(true);
      setError(null);
      setLoadingProgress(0);
      
      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 0.1, 0.8));
      }, 100);

      const [currentWeather, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(location.latitude, location.longitude),
        WeatherService.getForecast(location.latitude, location.longitude, 5)
      ]);

      clearInterval(progressInterval);
      setLoadingProgress(1);

      setWeather(currentWeather);
      setForecast(forecastData);
      
      // Pequeño delay para mostrar el progreso completo
      setTimeout(() => {
        setLoadingProgress(0);
      }, 500);

    } catch (err) {
      console.error('Error loading weather data:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos del clima');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    if (selectedLocation) {
      // Si hay una ubicación seleccionada manualmente, recargar esos datos
      await loadWeatherData(selectedLocation);
    } else {
      // Si no hay ubicación manual, refrescar ubicación del dispositivo
      await refreshLocation();
      if (deviceLocation) {
        await loadWeatherData(deviceLocation);
      }
    }
    
    setRefreshing(false);
  };

  const handleLocationSelect = (newLocation: LocationData) => {
    console.log('Nueva ubicación seleccionada:', newLocation);
    setSelectedLocation(newLocation);
    setShowCitySearch(false);
    // loadWeatherData se llamará automáticamente por el useEffect que observa currentLocation
  };

  const handleUseCurrentLocation = () => {
    if (deviceLocation) {
      setSelectedLocation(null); // Limpiar ubicación manual
      // Esto hará que currentLocation vuelva a ser deviceLocation
    } else {
      Alert.alert(
        'Ubicación no disponible',
        'No se pudo obtener tu ubicación actual. Por favor, busca una ciudad manualmente.',
        [
          { text: 'Buscar Ciudad', onPress: () => setShowCitySearch(true) },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }
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

  // Manejo de errores de ubicación
  if (locationError && !selectedLocation) {
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

  // Pantalla de carga con buscador integrado
  if ((locationLoading && !selectedLocation) || loading) {
    const loadingMessage = selectedLocation 
      ? `Obteniendo clima de ${selectedLocation.name}...`
      : 'Obteniendo tu ubicación y datos del clima...';
      
    return (
      <LoadingWeather 
        message={loadingMessage}
        showSearchOption={true}
        onLocationSelect={handleLocationSelect}
        loadingProgress={loadingProgress > 0 ? loadingProgress : undefined}
      />
    );
  }

  // Manejo de errores de datos del clima
  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.triangle" size={60} color="#FF6B6B" />
        <ThemedText style={styles.errorTitle}>Error</ThemedText>
        <ThemedText style={styles.errorMessage}>{error}</ThemedText>
        <View style={styles.errorButtons}>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadWeatherData(currentLocation!)}>
            <ThemedText style={styles.retryButtonText}>Reintentar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.retryButton, styles.searchButtonError]} 
            onPress={() => setShowCitySearch(true)}
          >
            <ThemedText style={styles.retryButtonText}>Buscar otra ciudad</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  // Pantalla de búsqueda de ciudades
  if (showCitySearch) {
    return (
      <CitySearch
        onLocationSelect={handleLocationSelect}
        onClose={() => setShowCitySearch(false)}
      />
    );
  }

  // Pantalla principal con datos del clima
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {weather && currentLocation && (
        <WeatherCard
          weather={weather}
          city={currentLocation.city || currentLocation.name || 'Ubicación desconocida'}
          country={currentLocation.country}
        />
      )}

      <ThemedView style={styles.forecastContainer}>
        <View style={styles.forecastHeader}>
          <ThemedText type="subtitle" style={styles.forecastTitle}>
            Pronóstico 5 Días
          </ThemedText>
          
          <View style={styles.headerButtons}>
            {/* Botón para usar ubicación actual */}
            {selectedLocation && deviceLocation && (
              <TouchableOpacity
                style={[styles.locationButton, { borderColor: colors.tint }]}
                onPress={handleUseCurrentLocation}
              >
                <IconSymbol name="location.fill" size={16} color={colors.tint} />
              </TouchableOpacity>
            )}
            
            {/* Botón de búsqueda */}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => setShowCitySearch(true)}
            >
              <IconSymbol name="magnifyingglass" size={20} color={colors.tint} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Indicador de ubicación actual */}
        {currentLocation && (
          <View style={styles.locationIndicator}>
            <IconSymbol 
              name={selectedLocation ? "map.fill" : "location.fill"} 
              size={14} 
              color={colors.icon} 
            />
            <ThemedText style={styles.locationText}>
              {selectedLocation 
                ? `Ubicación personalizada: ${selectedLocation.name}${selectedLocation.country ? `, ${selectedLocation.country}` : ''}`
                : 'Ubicación actual'
              }
            </ThemedText>
          </View>
        )}

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
  errorButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 180,
  },
  searchButtonError: {
    backgroundColor: '#6C757D',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 123, 255, 0.05)',
  },
  searchButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: 8,
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  locationText: {
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});