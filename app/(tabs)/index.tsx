import { IconTest } from '@/components/debug/IconTest';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ModernCard } from '@/components/ui/ModernCard';
import { CitySearch } from '@/components/weather/CitySearch';
import { ForecastItem } from '@/components/weather/ForecastItem';
import { LoadingWeather } from '@/components/weather/LoadingWeather';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { Colors } from '@/constants/theme';
import { useWeatherContext } from '@/contexts/WeatherContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocation } from '@/hooks/useLocation';
import { ForecastData, LocationData, WeatherData, WeatherService } from '@/services/weatherService';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const { location: deviceLocation, loading: locationLoading, error: locationError, refreshLocation } = useLocation();
  const { selectedLocation, setSelectedLocation, currentLocation, setDeviceLocation } = useWeatherContext();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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

  // Actualizar la ubicación del dispositivo en el contexto
  useEffect(() => {
    if (deviceLocation) {
      setDeviceLocation(deviceLocation);
    }
  }, [deviceLocation, setDeviceLocation]);

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
          <FloatingActionButton
            onPress={() => loadWeatherData(currentLocation!)}
            icon="arrow.clockwise"
            label="Reintentar"
            variant="primary"
          />
          <FloatingActionButton
            onPress={() => setShowCitySearch(true)}
            icon="magnifyingglass"
            label="Buscar ciudad"
            variant="secondary"
          />
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
    <GradientBackground variant="primary">
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {weather && currentLocation && (
          <WeatherCard
            weather={weather}
            city={currentLocation.city || currentLocation.name || 'Ubicación desconocida'}
            country={currentLocation.country}
          />
        )}

        <ModernCard 
          variant="elevated" 
          style={styles.forecastContainer}
          padding="large"
          borderRadius="xl"
        >
          <View style={styles.forecastHeader}>
            <View style={styles.forecastTitleContainer}>
              <IconSymbol name="calendar" size={24} color={colors.primary} />
              <ThemedText type="subtitle" style={styles.forecastTitle}>
                Pronóstico 5 Días
              </ThemedText>
            </View>
            
            <View style={styles.headerButtons}>
              {/* Botón para usar ubicación actual */}
              {selectedLocation && deviceLocation && (
                <TouchableOpacity
                  style={[styles.locationButton, { borderColor: colors.primary }]}
                  onPress={handleUseCurrentLocation}
                  activeOpacity={0.7}
                >
                  <IconSymbol name="location.fill" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
              
              {/* Botón de búsqueda */}
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: colors.primary + '20' }]}
                onPress={() => setShowCitySearch(true)}
                activeOpacity={0.7}
              >
                <IconSymbol name="magnifyingglass" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Indicador de ubicación actual */}
          {currentLocation && (
            <ModernCard 
              variant="filled" 
              style={styles.locationIndicator}
              padding="small"
              borderRadius="medium"
            >
              <View style={styles.locationIndicatorContent}>
                <IconSymbol 
                  name={selectedLocation ? "map.fill" : "location.fill"} 
                  size={16} 
                  color={colors.primary} 
                />
                <ThemedText style={styles.locationText}>
                  {selectedLocation 
                    ? `Ubicación personalizada: ${selectedLocation.name}${selectedLocation.country ? `, ${selectedLocation.country}` : ''}`
                    : 'Ubicación actual'
                  }
                </ThemedText>
              </View>
            </ModernCard>
          )}

          <View style={styles.forecastList}>
        {forecast.map((day, index) => {
          // Determinar si es hoy basándose en la fecha real
          const today = new Date();
          const todayDate = today.toISOString().split('T')[0];
          const forecastDate = day.date;
          const isToday = forecastDate === todayDate;
          
          return (
            <ForecastItem
              key={day.date}
              forecast={day}
              isToday={isToday}
            />
          );
        })}
          </View>
        </ModernCard>

        {/* Componente de prueba de iconos - temporal */}
        <IconTest />

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
    gap: 16,
  },
  forecastContainer: {
    margin: 16,
    marginTop: 8,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  forecastTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  locationIndicator: {
    marginBottom: 16,
  },
  locationIndicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    opacity: 0.8,
    fontWeight: '500',
    flex: 1,
  },
  forecastList: {
    gap: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});