import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ModernCard } from '@/components/ui/ModernCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LocationData } from '@/services/weatherService';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface LocationIndicatorProps {
  location: LocationData;
  isCurrentLocation: boolean;
  lastUpdated?: Date;
}

export function LocationIndicator({ location, isCurrentLocation, lastUpdated }: LocationIndicatorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const pulseAnimation = useSharedValue(1);
  const fadeAnimation = useSharedValue(1);

  useEffect(() => {
    // Animación de pulso para ubicación actual
    if (isCurrentLocation) {
      pulseAnimation.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }

    // Animación de fade para actualizaciones
    if (lastUpdated) {
      fadeAnimation.value = withSequence(
        withTiming(0.5, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [isCurrentLocation, lastUpdated]);

  const getLocationStatus = () => {
    if (isCurrentLocation) {
      return {
        icon: 'location.fill',
        text: 'Ubicación actual',
        color: colors.success,
        description: 'Actualizada automáticamente'
      };
    } else {
      return {
        icon: 'map.fill',
        text: 'Ubicación personalizada',
        color: colors.primary,
        description: 'Seleccionada manualmente'
      };
    }
  };

  const getLastUpdateText = () => {
    if (!lastUpdated) return '';
    
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Actualizado ahora';
    if (diffMinutes < 60) return `Actualizado hace ${diffMinutes} min`;
    if (diffMinutes < 1440) return `Actualizado hace ${Math.floor(diffMinutes / 60)} h`;
    return `Actualizado hace ${Math.floor(diffMinutes / 1440)} días`;
  };

  const status = getLocationStatus();
  const lastUpdateText = getLastUpdateText();

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnimation.value,
  }));

  return (
    <Animated.View style={[styles.container, fadeStyle]}>
      <ModernCard 
        variant="filled" 
        style={styles.card}
        padding="small"
        borderRadius="medium"
      >
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, pulseStyle]}>
            <IconSymbol 
              name={status.icon} 
              size={16} 
              color={status.color} 
            />
          </Animated.View>
          
          <View style={styles.textContainer}>
            <ThemedText style={[styles.locationText, { color: status.color }]}>
              {status.text}
            </ThemedText>
            <ThemedText style={styles.description}>
              {status.description}
            </ThemedText>
            {lastUpdateText && (
              <ThemedText style={styles.lastUpdate}>
                {lastUpdateText}
              </ThemedText>
            )}
          </View>
        </View>
      </ModernCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  lastUpdate: {
    fontSize: 10,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
