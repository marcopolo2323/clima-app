# 🌤️ Clima App

Una aplicación del clima moderna y minimalista construida con React Native y Expo, utilizando la API gratuita de Open-Meteo.

## ✨ Características

- **Clima actual**: Temperatura, humedad, viento, presión atmosférica, visibilidad e índice UV
- **Pronóstico extendido**: Pronóstico de 5-7 días con temperaturas máximas y mínimas
- **Búsqueda de ciudades**: Busca cualquier ciudad del mundo
- **Ubicación automática**: Obtiene automáticamente tu ubicación actual
- **Animaciones**: Iconos animados que reflejan las condiciones climáticas
- **Modo oscuro/claro**: Soporte automático para temas
- **Consejos del clima**: Recomendaciones basadas en las condiciones actuales
- **Información técnica**: Datos meteorológicos detallados

## 🚀 Instalación

1. Clona el repositorio
   ```bash
   git clone <url-del-repositorio>
   cd clima-app
   ```

2. Instala las dependencias
   ```bash
   npm install
   ```

3. Inicia la aplicación
   ```bash
   npx expo start
   ```

## 📱 Uso

### Pantalla Principal (Clima)
- Muestra el clima actual de tu ubicación
- Incluye temperatura, descripción y detalles meteorológicos
- Pronóstico de 5 días con temperaturas y condiciones
- Botón de búsqueda para cambiar de ciudad

### Pantalla de Detalles
- Consejos del clima basados en las condiciones actuales
- Pronóstico extendido de 7 días
- Información técnica detallada
- Fuente de datos y credibilidad

## 🛠️ Tecnologías Utilizadas

- **React Native**: Framework para aplicaciones móviles
- **Expo**: Plataforma de desarrollo y herramientas
- **TypeScript**: Tipado estático para JavaScript
- **Open-Meteo API**: API gratuita de datos meteorológicos
- **Expo Location**: Servicios de ubicación
- **React Native Reanimated**: Animaciones fluidas
- **Expo Vector Icons**: Iconos del sistema

## 📊 API de Open-Meteo

Esta aplicación utiliza la API gratuita de [Open-Meteo](https://open-meteo.com/), que proporciona:

- Datos meteorológicos en tiempo real
- Pronósticos de hasta 16 días
- Cobertura global
- Sin necesidad de API key
- Actualizaciones cada hora

## 🎨 Diseño

La aplicación sigue un diseño minimalista inspirado en las aplicaciones de clima más populares:

- **Colores**: Paleta suave que cambia según la temperatura
- **Tipografía**: Fuentes del sistema para mejor legibilidad
- **Iconos**: Iconos SF Symbols para iOS y Material Design para Android
- **Animaciones**: Transiciones suaves y animaciones contextuales
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## 🔧 Configuración

### Permisos de Ubicación
La aplicación solicita permisos de ubicación para mostrar el clima de tu zona actual. Los permisos se configuran automáticamente en `app.json`.

### Personalización
Puedes personalizar:
- Colores en `constants/theme.ts`
- Iconos de clima en `services/weatherService.ts`
- Animaciones en `components/weather/WeatherAnimation.tsx`

## 📱 Compatibilidad

- **iOS**: 13.0+
- **Android**: API 21+
- **Web**: Navegadores modernos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Open-Meteo](https://open-meteo.com/) por la API gratuita de datos meteorológicos
- [Expo](https://expo.dev/) por las herramientas de desarrollo
- [React Native](https://reactnative.dev/) por el framework
- La comunidad de desarrolladores de React Native

---

Desarrollado con ❤️ usando React Native y Expo