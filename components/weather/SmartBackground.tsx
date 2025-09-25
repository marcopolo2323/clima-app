import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface SmartBackgroundProps {
  weatherCode: number;
  temperature: number;
  children: React.ReactNode;
}

export function SmartBackground({ weatherCode, temperature, children }: SmartBackgroundProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentSeason, setCurrentSeason] = useState<string>('');

  const backgroundShift = useSharedValue(0);
  const temperaturePulse = useSharedValue(1);

  useEffect(() => {
    // Determinar estación del año
    const month = new Date().getMonth();
    let season = '';
    
    if (month >= 11 || month <= 2) {
      season = 'winter';
    } else if (month >= 3 && month <= 5) {
      season = 'spring';
    } else if (month >= 6 && month <= 8) {
      season = 'summer';
    } else {
      season = 'autumn';
    }
    
    setCurrentSeason(season);

    // Animación de cambio de fondo
    backgroundShift.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Pulso de temperatura
    temperaturePulse.value = withRepeat(
      withSequence(
        withTiming(1.01, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [weatherCode, temperature]);

  const getSmartBackgroundImage = () => {
    const hour = new Date().getHours();
    const month = new Date().getMonth();
    
    // Determinar período del día
    let timeOfDay = 'tarde';
    if (hour >= 6 && hour < 12) {
      timeOfDay = 'mañana';
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = 'tarde';
    } else {
      timeOfDay = 'noche';
    }

    // Ajustar según el clima y la estación
    if (weatherCode >= 61 && weatherCode <= 65) { // Lluvia
      if (currentSeason === 'winter') {
        return require('@/assets/images/noche_fondo_app.jpg');
      } else if (currentSeason === 'spring') {
        return require('@/assets/images/mañana_fondo_app.jpg');
      } else {
        return require('@/assets/images/tarde_fondo_app.jpg');
      }
    } else if (weatherCode >= 95 && weatherCode <= 99) { // Tormenta
      return require('@/assets/images/noche_fondo_app.jpg');
    } else if (weatherCode >= 71 && weatherCode <= 77) { // Nieve
      return require('@/assets/images/mañana_fondo_app.jpg');
    } else if (weatherCode === 0 || weatherCode === 1) { // Cielo despejado
      if (currentSeason === 'summer') {
        return require('@/assets/images/tarde_fondo_app.jpg');
      } else if (currentSeason === 'winter') {
        return require('@/assets/images/mañana_fondo_app.jpg');
      } else {
        return require('@/assets/images/fondo_app.jpg');
      }
    }

    // Retornar según la hora del día
    const backgroundImages = {
      mañana: require('@/assets/images/mañana_fondo_app.jpg'),
      tarde: require('@/assets/images/tarde_fondo_app.jpg'),
      noche: require('@/assets/images/noche_fondo_app.jpg'),
      default: require('@/assets/images/fondo_app.jpg'),
    };

    return backgroundImages[timeOfDay as keyof typeof backgroundImages] || backgroundImages.default;
  };

  const getSmartGradient = () => {
    const isDark = colorScheme === 'dark';
    
    // Gradientes inteligentes basados en clima, temperatura y estación
    const baseGradient = {
      clear: isDark 
        ? ['rgba(255, 215, 0, 0.1)', 'rgba(135, 206, 235, 0.05)', 'rgba(30, 144, 255, 0.02)']
        : ['rgba(255, 215, 0, 0.15)', 'rgba(135, 206, 235, 0.1)', 'rgba(30, 144, 255, 0.05)'],
      cloudy: isDark
        ? ['rgba(176, 196, 222, 0.1)', 'rgba(211, 211, 211, 0.05)', 'rgba(169, 169, 169, 0.02)']
        : ['rgba(176, 196, 222, 0.15)', 'rgba(211, 211, 211, 0.1)', 'rgba(169, 169, 169, 0.05)'],
      rain: isDark
        ? ['rgba(70, 130, 180, 0.15)', 'rgba(95, 158, 160, 0.1)', 'rgba(135, 206, 235, 0.05)']
        : ['rgba(70, 130, 180, 0.2)', 'rgba(95, 158, 160, 0.15)', 'rgba(135, 206, 235, 0.1)'],
      snow: isDark
        ? ['rgba(240, 248, 255, 0.1)', 'rgba(230, 243, 255, 0.05)', 'rgba(204, 231, 255, 0.02)']
        : ['rgba(240, 248, 255, 0.15)', 'rgba(230, 243, 255, 0.1)', 'rgba(204, 231, 255, 0.05)'],
      storm: isDark
        ? ['rgba(72, 61, 139, 0.15)', 'rgba(106, 90, 205, 0.1)', 'rgba(147, 112, 219, 0.05)']
        : ['rgba(72, 61, 139, 0.2)', 'rgba(106, 90, 205, 0.15)', 'rgba(147, 112, 219, 0.1)'],
    };

    // Ajustar según la temperatura
    let temperatureMultiplier = 1;
    if (temperature < 0) {
      temperatureMultiplier = 0.8; // Más frío, menos saturación
    } else if (temperature > 30) {
      temperatureMultiplier = 1.2; // Más caliente, más saturación
    }

    // Ajustar según la estación
    let seasonMultiplier = 1;
    if (currentSeason === 'winter') {
      seasonMultiplier = 0.7; // Invierno más sutil
    } else if (currentSeason === 'summer') {
      seasonMultiplier = 1.3; // Verano más vibrante
    }

    const finalMultiplier = temperatureMultiplier * seasonMultiplier;

    // Aplicar multiplicador a los gradientes
    const applyMultiplier = (gradient: string[]) => 
      gradient.map(color => {
        const alpha = parseFloat(color.split(',')[3]?.split(')')[0] || '0.1');
        const newAlpha = Math.min(alpha * finalMultiplier, 0.3);
        return color.replace(/[\d.]+\)$/, `${newAlpha})`);
      });

    // Seleccionar gradiente base según el clima
    if (weatherCode === 0 || weatherCode === 1) return applyMultiplier(baseGradient.clear);
    if (weatherCode === 2 || weatherCode === 3) return applyMultiplier(baseGradient.cloudy);
    if (weatherCode >= 61 && weatherCode <= 65) return applyMultiplier(baseGradient.rain);
    if (weatherCode >= 71 && weatherCode <= 77) return applyMultiplier(baseGradient.snow);
    if (weatherCode >= 95 && weatherCode <= 99) return applyMultiplier(baseGradient.storm);
    
    return applyMultiplier(baseGradient.clear);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: temperaturePulse.value },
    ],
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    opacity: 0.8 + backgroundShift.value * 0.2,
  }));

  return (
    <ImageBackground
      source={getSmartBackgroundImage()}
      style={styles.container}
      resizeMode="cover"
    >
      <Animated.View style={[styles.overlay, animatedStyle]}>
        <LinearGradient
          colors={getSmartGradient()}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[styles.content, gradientStyle]}>
            {children}
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
