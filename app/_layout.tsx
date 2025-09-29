/**
 * LAYOUT PRINCIPAL DE LA APLICACIÓN
 * =================================
 * 
 * Este archivo configura la estructura base de la app:
 * - Proveedor global de tema (claro/oscuro)
 * - Proveedor de contexto del clima para toda la aplicación
 * - Navegación principal con Stack y configuración de tabs
 * - StatusBar adaptativo según el tema
 * 
 * Arquitectura:
 * - WeatherProvider envuelve toda la app para acceso global al estado del clima
 * - ThemeProvider maneja automáticamente el tema claro/oscuro
 * - Stack navegador con anclaje a la sección de tabs
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { WeatherProvider } from '@/contexts/WeatherContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Configuración de navegación: ancla principal en la sección de tabs
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <WeatherProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Pantalla principal con tabs de navegación */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        {/* Barra de estado que se adapta automáticamente al tema */}
        <StatusBar style="auto" />
      </ThemeProvider>
    </WeatherProvider>
  );
}
