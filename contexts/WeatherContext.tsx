/**
 * CONTEXTO GLOBAL DEL CLIMA
 * ========================
 * 
 * Este contexto maneja el estado global de ubicación en toda la aplicación:
 * - selectedLocation: Ubicación seleccionada manualmente por el usuario
 * - deviceLocation: Ubicación obtenida del GPS del dispositivo
 * - currentLocation: Ubicación activa (prioriza selección manual sobre GPS)
 * 
 * Flujo de ubicación:
 * 1. Al iniciar la app, se obtiene la ubicación del GPS (deviceLocation)
 * 2. Si el usuario busca una ciudad, se guarda como selectedLocation
 * 3. currentLocation siempre usa selectedLocation si existe, sino deviceLocation
 * 4. Todos los componentes de clima reaccionan automáticamente a cambios en currentLocation
 * 
 * Ventajas de esta arquitectura:
 * - Estado centralizado y predecible
 * - Separación clara entre ubicación del dispositivo y selección manual
 * - Fácil acceso desde cualquier componente sin prop drilling
 */

import { LocationData } from '@/services/weatherService';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface WeatherContextType {
  selectedLocation: LocationData | null;     // Ubicación seleccionada manualmente
  setSelectedLocation: (location: LocationData | null) => void;
  deviceLocation: LocationData | null;       // Ubicación del GPS del dispositivo
  setDeviceLocation: (location: LocationData | null) => void;
  currentLocation: LocationData | null;      // Ubicación activa (selected || device)
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [deviceLocation, setDeviceLocation] = useState<LocationData | null>(null);

  // Lógica de prioridad: ubicación seleccionada manualmente tiene prioridad sobre GPS
  const currentLocation = selectedLocation || deviceLocation;

  const value = {
    selectedLocation,
    setSelectedLocation,
    deviceLocation,
    setDeviceLocation,
    currentLocation,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
}
