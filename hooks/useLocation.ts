import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar si los servicios de ubicación están disponibles
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        console.warn('Servicios de ubicación deshabilitados, usando ubicación por defecto');
        // Usar Pucallpa, Perú como ubicación por defecto
        setLocation({
          latitude: -8.3833,
          longitude: -74.5333,
          city: 'Pucallpa',
          country: 'Perú',
        });
        return;
      }

      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permisos de ubicación denegados, usando ubicación por defecto');
        // Usar Pucallpa, Perú como ubicación por defecto
        setLocation({
          latitude: -8.3833,
          longitude: -74.5333,
          city: 'Pucallpa',
          country: 'Perú',
        });
        return;
      }

      // Obtener ubicación actual con timeout
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // 10 segundos
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de ubicación')), 15000)
        )
      ]) as Location.LocationObject;

      // Obtener información de la ciudad
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const address = reverseGeocode[0];
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        city: address?.city || address?.subregion || 'Ubicación desconocida',
        country: address?.country || '',
      });
    } catch (err) {
      console.error('Error getting location:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener ubicación';
      setError(errorMessage);
      
      // En caso de error, usar ubicación por defecto
      console.warn('Usando ubicación por defecto debido a error:', errorMessage);
      setLocation({
        latitude: -8.3833,
        longitude: -74.5333,
        city: 'Pucallpa',
        country: 'Perú',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = (newLocation: LocationData) => {
    setLocation(newLocation);
  };

  return {
    location,
    loading,
    error,
    refreshLocation: getCurrentLocation,
    updateLocation,
  };
}

