import { LocationData } from '@/services/weatherService';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface WeatherContextType {
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData | null) => void;
  deviceLocation: LocationData | null;
  setDeviceLocation: (location: LocationData | null) => void;
  currentLocation: LocationData | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [deviceLocation, setDeviceLocation] = useState<LocationData | null>(null);

  // La ubicación actual es la seleccionada manualmente o la del dispositivo
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
