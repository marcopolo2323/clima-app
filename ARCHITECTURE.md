# Arquitectura de la Aplicación de Clima

## 📋 Resumen General

Esta es una aplicación de clima desarrollada con **Expo Router** y **React Native** que proporciona información meteorológica en tiempo real con una interfaz moderna y animaciones atractivas.

## 🏗️ Estructura de Archivos

### 📱 App (Navegación)
```
app/
├── _layout.tsx              # Layout raíz con proveedores globales
└── (tabs)/
    ├── _layout.tsx          # Configuración de navegación por tabs
    ├── index.tsx            # Pantalla principal del clima
    └── explore.tsx          # Pantalla de detalles extendidos
```

### 🔧 Contextos y Estado
```
contexts/
└── WeatherContext.tsx       # Contexto global para gestión de ubicación
```

### 🎣 Hooks Personalizados
```
hooks/
├── use-color-scheme.ts      # Hook para tema claro/oscuro (nativo)
├── use-color-scheme.web.ts  # Hook para tema claro/oscuro (web)
├── use-theme-color.ts       # Hook para colores del tema
└── useLocation.ts           # Hook para gestión de ubicación GPS
```

### 🌐 Servicios
```
services/
├── weatherService.ts        # Servicio principal de clima
└── providers/
    └── openWeather.ts       # Adaptador para API OpenWeather
```

### 🎨 Componentes UI
```
components/
├── themed-text.tsx          # Componente de texto con tema
├── themed-view.tsx          # Componente de vista con tema
├── haptic-tab.tsx           # Tab con feedback háptico
└── ui/
    ├── FloatingActionButton.tsx  # Botón flotante de acción
    ├── GradientBackground.tsx    # Fondo con degradado
    ├── IconSymbol.tsx            # Iconos SF Symbols
    ├── icon-symbol.ios.tsx       # Iconos específicos iOS
    └── ModernCard.tsx            # Tarjeta moderna reutilizable
```

### 🌤️ Componentes de Clima
```
components/weather/
├── WeatherCard.tsx          # Tarjeta principal del clima
├── LoadingWeather.tsx       # Estado de carga con animaciones
├── CitySearch.tsx           # Búsqueda de ciudades
├── LocationIndicator.tsx    # Indicador de ubicación actual
├── HourlyForecast.tsx       # Pronóstico por horas
├── ForecastItem.tsx         # Elemento individual del pronóstico
├── SmartBackground.tsx      # Fondo inteligente según clima
├── WeatherAnimation.tsx     # Animaciones meteorológicas
├── WeatherEffects.tsx       # Efectos visuales (partículas, rayos)
├── DynamicElements.tsx      # Elementos dinámicos del clima
├── FloatingObjects.tsx      # Objetos flotantes animados
├── WeatherBackground.tsx    # Fondo específico del clima
├── WeatherMood.tsx          # Estado de ánimo según clima
└── InteractiveWeather.tsx   # Elementos interactivos del clima
```

### 🎨 Constantes y Utilidades
```
constants/
└── theme.ts                 # Paleta de colores y temas

utils/
└── dateUtils.ts             # Utilidades para fechas y tiempo
```

## 🔄 Flujo de Datos

### 1. Inicialización
1. `app/_layout.tsx` monta `WeatherProvider` y `ThemeProvider`
2. `useLocation` solicita permisos GPS y obtiene ubicación
3. `WeatherContext` establece `currentLocation` como `selectedLocation || deviceLocation`

### 2. Obtención de Datos
1. `WeatherService` verifica proveedor configurado (Open-Meteo por defecto)
2. Si `EXPO_PUBLIC_USE_OPENWEATHER=1`, usa OpenWeather con API key
3. Si no, usa Open-Meteo (gratuito, sin API key)
4. Obtiene clima actual, pronóstico y datos por horas

### 3. Renderizado UI
1. `WeatherCard` muestra información principal con animaciones
2. `HourlyForecast` lista pronóstico por horas
3. `ForecastItem` elementos del pronóstico de 7 días
4. `DetailsPanel` métricas detalladas (humedad, viento, UV, etc.)

## 🎯 Características Principales

### 🌍 Gestión de Ubicación
- **GPS automático**: Ubicación del dispositivo con fallback a Pucallpa, Perú
- **Búsqueda manual**: Selección de ciudades con geocodificación
- **Prioridad inteligente**: Ubicación seleccionada > GPS del dispositivo

### 🌤️ Datos Meteorológicos
- **Clima actual**: Temperatura, humedad, viento, presión, UV, visibilidad
- **Pronóstico**: 7 días con máximas/mínimas y descripciones
- **Por horas**: 24 horas de pronóstico detallado
- **Amanecer/Atardecer**: Horarios según ubicación

### 🎨 Interfaz de Usuario
- **Tema adaptativo**: Claro/oscuro automático
- **Animaciones fluidas**: Partículas, rayos, efectos de viento
- **Fondos inteligentes**: Cambian según clima y temperatura
- **Feedback háptico**: En navegación y interacciones
- **Pull-to-refresh**: Actualización manual de datos

### 🔧 Arquitectura Técnica
- **Proveedores múltiples**: Open-Meteo (gratuito) y OpenWeather (premium)
- **Estado centralizado**: Context API para ubicación global
- **Tipado fuerte**: TypeScript en toda la aplicación
- **Responsive**: Adaptativo a diferentes tamaños de pantalla

## 🚀 Configuración

### Variables de Entorno
```bash
# Para usar OpenWeather en lugar de Open-Meteo
EXPO_PUBLIC_USE_OPENWEATHER=1
EXPO_PUBLIC_OPENWEATHER_KEY=tu_api_key_aqui
```

### Dependencias Principales
- **Expo Router**: Navegación y routing
- **React Native Reanimated**: Animaciones fluidas
- **Expo Location**: Gestión de ubicación GPS
- **Expo Haptics**: Feedback háptico

## 📱 Pantallas

### 🏠 Pantalla Principal (`index.tsx`)
- Tarjeta principal del clima con animaciones
- Pronóstico por horas deslizable
- Lista de pronóstico de 7 días
- Búsqueda de ciudades
- Botón flotante para acciones rápidas

### 📊 Pantalla de Detalles (`explore.tsx`)
- Métricas de confort (humedad, sensación térmica, UV)
- Información de viento (dirección, velocidad)
- Horarios de amanecer/atardecer
- Pronóstico extendido de 7 días
- Consejos personalizados según clima
- Fuente de datos y verificación

## 🎨 Sistema de Temas

### Colores Adaptativos
- **Tema claro**: Colores brillantes para uso diurno
- **Tema oscuro**: Colores suaves para uso nocturno
- **Colores de clima**: Azules para frío, rojos para calor
- **Estados**: Warning, success, error con colores específicos

### Iconos
- **SF Symbols**: Iconos nativos de Apple para iOS
- **Fallbacks**: Iconos alternativos para otras plataformas
- **Dinámicos**: Cambian según condiciones meteorológicas

## 🔄 Estados y Gestión de Errores

### Estados de Carga
- **Loading inicial**: Animación de carga con progreso
- **Refreshing**: Pull-to-refresh con indicador
- **Error handling**: Mensajes claros y opciones de recuperación

### Fallbacks
- **Ubicación**: Pucallpa, Perú si no hay GPS/permisos
- **Datos**: Mensajes informativos si falla la API
- **Red**: Retry automático y opciones manuales

## 🧪 Testing y Calidad

### TypeScript
- **Tipado estricto**: Interfaces para todos los datos
- **Validación**: Tipos en tiempo de compilación
- **IntelliSense**: Autocompletado y detección de errores

### Linting
- **ESLint**: Reglas de código consistentes
- **Formato**: Código limpio y legible
- **Mejores prácticas**: Estándares de React Native

## 📈 Rendimiento

### Optimizaciones
- **Lazy loading**: Carga bajo demanda de componentes
- **Memoización**: Evita re-renders innecesarios
- **Animaciones nativas**: 60fps con Reanimated
- **Caché inteligente**: Datos meteorológicos con TTL

### Bundle Size
- **Tree shaking**: Eliminación de código no usado
- **Code splitting**: Carga modular de funcionalidades
- **Assets optimizados**: Imágenes y iconos comprimidos

---

*Esta arquitectura proporciona una base sólida, escalable y mantenible para la aplicación de clima, con separación clara de responsabilidades y patrones modernos de React Native.*
