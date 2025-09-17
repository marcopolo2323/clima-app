import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Animated, Easing } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CitySearch } from '@/components/weather/CitySearch';
import { LocationData } from '@/services/weatherService';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface LoadingWeatherProps {
  message?: string;
  showSearchOption?: boolean;
  onLocationSelect?: (location: LocationData) => void;
  loadingProgress?: number; // 0-1 para mostrar progreso
}

export function LoadingWeather({ 
  message = 'Obteniendo datos del clima...', 
  showSearchOption = true,
  onLocationSelect,
  loadingProgress 
}: LoadingWeatherProps) {
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.back(1.2),
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de rotación continua para el ícono
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, []);

  const handleLocationSelect = (location: LocationData) => {
    setShowCitySearch(false);
    onLocationSelect?.(location);
  };

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (showCitySearch) {
    return (
      <CitySearch
        onLocationSelect={handleLocationSelect}
        onClose={() => setShowCitySearch(false)}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Círculo de fondo decorativo */}
        <View style={[styles.decorativeCircle, { borderColor: colors.tint + '20' }]} />
        
        {/* Ícono principal con animación */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ rotate: rotateInterpolation }] }
          ]}
        >
          <IconSymbol
            name="cloud.sun.fill"
            size={70}
            color={colors.tint}
            style={styles.icon}
          />
        </Animated.View>

        {/* Indicador de progreso personalizado */}
        {loadingProgress !== undefined ? (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.tint + '30' }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.tint,
                    width: `${loadingProgress * 100}%`
                  }
                ]} 
              />
            </View>
            <ThemedText style={styles.progressText}>
              {Math.round(loadingProgress * 100)}%
            </ThemedText>
          </View>
        ) : (
          <ActivityIndicator
            size="large"
            color={colors.tint}
            style={styles.spinner}
          />
        )}

        {/* Mensaje principal */}
        <ThemedText style={styles.message}>
          {message}
        </ThemedText>

        {/* Puntos de carga animados */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: colors.tint },
                {
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 1, 0.3],
                  }),
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, -5, 0],
                    })
                  }]
                }
              ]}
            />
          ))}
        </View>

        {/* Botón de búsqueda manual */}
        {showSearchOption && (
          <TouchableOpacity
            style={[styles.searchButton, { borderColor: colors.tint }]}
            onPress={() => setShowCitySearch(true)}
            activeOpacity={0.8}
          >
            <IconSymbol
              name="magnifyingglass"
              size={20}
              color={colors.tint}
              style={styles.searchIcon}
            />
            <ThemedText style={[styles.searchButtonText, { color: colors.tint }]}>
              Buscar ciudad manualmente
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* Texto de ayuda */}
        <ThemedText style={styles.helpText}>
          Si la ubicación automática no funciona, puedes buscar tu ciudad manualmente
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
    width: '100%',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    top: -20,
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
  },
  icon: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    opacity: 0.7,
  },
  spinner: {
    marginBottom: 20,
    transform: [{ scale: 1.2 }],
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 16,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 16,
    backgroundColor: 'rgba(0, 123, 255, 0.05)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});