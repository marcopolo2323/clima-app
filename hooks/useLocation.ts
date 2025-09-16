import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

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

      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permisos de ubicación denegados');
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

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
      setError(err instanceof Error ? err.message : 'Error al obtener ubicación');
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

