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

      // Obtener ubicación actual con timeout más agresivo
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5 segundos para respuesta más rápida
          distanceInterval: 10, // Actualizar cada 10 metros
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de ubicación')), 10000)
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

  // Función para actualizar ubicación automáticamente cada 5 minutos
  const startLocationTracking = () => {
    const interval = setInterval(async () => {
      try {
        const newLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 300000, // 5 minutos
        });
        
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
        });

        const address = reverseGeocode[0];
        setLocation({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          city: address?.city || address?.subregion || 'Ubicación desconocida',
          country: address?.country || '',
        });
      } catch (err) {
        console.log('Error en actualización automática de ubicación:', err);
      }
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  };

  return {
    location,
    loading,
    error,
    refreshLocation: getCurrentLocation,
    updateLocation,
    startLocationTracking,
  };
}

