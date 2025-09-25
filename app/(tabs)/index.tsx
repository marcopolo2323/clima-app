import { ThemedText } from '@/components/themed-text';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ModernCard } from '@/components/ui/ModernCard';
import { CitySearch } from '@/components/weather/CitySearch';
import { DetailsPanel } from '@/components/weather/DetailsPanel';
import { ForecastItem } from '@/components/weather/ForecastItem';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { LoadingWeather } from '@/components/weather/LoadingWeather';
import { LocationIndicator } from '@/components/weather/LocationIndicator';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { Colors } from '@/constants/theme';
import { useWeatherContext } from '@/contexts/WeatherContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocation } from '@/hooks/useLocation';
import { ForecastData, LocationData, WeatherData, WeatherService } from '@/services/weatherService';
import { isToday, isTomorrow } from '@/utils/dateUtils';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hourly, setHourly] = useState<import('@/services/weatherService').HourlyData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [lastLocationUpdate, setLastLocationUpdate] = useState<Date | null>(null);
  
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

      const [currentWeather, forecastData, hourlyData] = await Promise.all([
        WeatherService.getCurrentWeather(location.latitude, location.longitude),
        WeatherService.getForecast(location.latitude, location.longitude, 5),
        WeatherService.getHourly(location.latitude, location.longitude, 12),
      ]);

      clearInterval(progressInterval);
      setLoadingProgress(1);

      setWeather(currentWeather);
      setForecast(forecastData);
      setHourly(hourlyData);
      setLastLocationUpdate(new Date());
      
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
      <GradientBackground variant="primary">
        <View style={styles.errorContainer}>
          <IconSymbol name="location.slash" size={60} color="#FF6B6B" />
          <ThemedText style={styles.errorTitle}>Error de Ubicación</ThemedText>
          <ThemedText style={styles.errorMessage}>
            No se pudo obtener tu ubicación actual. Esto puede deberse a:
          </ThemedText>
          <ThemedText style={styles.errorSubMessage}>
            • Permisos de ubicación denegados{'\n'}
            • Servicios de ubicación deshabilitados{'\n'}
            • Problemas de conectividad
          </ThemedText>
          <ThemedText style={styles.errorSubMessage}>
            Usando Pucallpa, Perú como ubicación por defecto.
          </ThemedText>
          <View style={styles.errorButtons}>
            <FloatingActionButton
              onPress={handleLocationError}
              icon="magnifyingglass"
              label="Buscar Ciudad"
              variant="primary"
            />
            <FloatingActionButton
              onPress={refreshLocation}
              icon="arrow.clockwise"
              label="Reintentar"
              variant="secondary"
            />
          </View>
        </View>
      </GradientBackground>
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
      <GradientBackground variant="primary">
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={60} color="#FF6B6B" />
          <ThemedText style={styles.errorTitle}>Error de Datos</ThemedText>
          <ThemedText style={styles.errorMessage}>
            No se pudieron obtener los datos del clima. Esto puede deberse a:
          </ThemedText>
          <ThemedText style={styles.errorSubMessage}>
            • Problemas de conectividad a internet{'\n'}
            • Servicio de clima temporalmente no disponible{'\n'}
            • Error en la API del clima
          </ThemedText>
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
              label="Buscar Ciudad"
              variant="secondary"
            />
          </View>
        </View>
      </GradientBackground>
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

        {/* Hourly forecast strip */}
        {hourly.length > 0 && (
          <ModernCard variant="elevated" style={styles.forecastContainer} padding="large" borderRadius="xl">
            <View style={styles.forecastHeader}>
              <View style={styles.forecastTitleContainer}>
                <IconSymbol name="clock" size={24} color={colors.primary} />
                <ThemedText type="subtitle" style={styles.forecastTitle}>Pronóstico por horas</ThemedText>
              </View>
            </View>
            <HourlyForecast items={hourly} />
          </ModernCard>
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

          {/* Indicador de ubicación mejorado */}
          {currentLocation && (
            <LocationIndicator
              location={currentLocation}
              isCurrentLocation={!selectedLocation}
              lastUpdated={lastLocationUpdate}
            />
          )}

          <View style={styles.forecastList}>
        {forecast
          .filter((day) => !isToday(day.date)) // Filtrar el día de hoy
          .map((day, index) => {
            // Determinar si es mañana usando la función utilitaria
            const isTomorrowFlag = isTomorrow(day.date);
            
            return (
              <ForecastItem
                key={day.date}
                forecast={day}
                isToday={false} // Ya no será hoy porque lo filtramos
                isTomorrow={isTomorrowFlag}
              />
            );
          })}
          </View>
        </ModernCard>

        {/* Comfort level panel */}
        {weather && (
          <DetailsPanel humidity={weather.humidity} windSpeed={weather.windSpeed} uvIndex={weather.uvIndex} />
        )}


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
    opacity: 0.9,
    marginBottom: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  errorSubMessage: {
    fontSize: 14,
    textAlign: 'left',
    opacity: 0.8,
    marginBottom: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    lineHeight: 20,
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