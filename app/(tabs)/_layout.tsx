/**
 * LAYOUT DE NAVEGACIÓN POR TABS
 * =============================
 * 
 * Configura la navegación por pestañas de la aplicación:
 * - Tab "Clima": Pantalla principal con datos meteorológicos
 * - Tab "Detalles": Información extendida y pronóstico de 7 días
 * 
 * Características:
 * - Colores adaptativos según el tema (claro/oscuro)
 * - Iconos SF Symbols para cada tab
 * - Feedback háptico en las pestañas
 * - Headers ocultos para interfaz limpia
 */

import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Clima',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cloud.sun.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Detalles',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="info.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
