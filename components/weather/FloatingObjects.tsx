import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface FloatingObjectsProps {
  weatherCode: number;
  temperature: number;
}

export function FloatingObjects({ weatherCode, temperature }: FloatingObjectsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const cloudFloat = useSharedValue(0);
  const birdFly = useSharedValue(0);
  const leafFall = useSharedValue(0);
  const snowFloat = useSharedValue(0);
  const rainDrop = useSharedValue(0);

  useEffect(() => {
    // Nubes flotantes
    cloudFloat.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 15000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 15000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Pájaros volando
    birdFly.value = withRepeat(
      withTiming(1, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );

    // Hojas cayendo (otoño)
    leafFall.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Nieve flotante
    snowFloat.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );

    // Gotas de lluvia
    rainDrop.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, [weatherCode, temperature]);

  const getCloudStyle = (index: number) => {
    return useAnimatedStyle(() => ({
      transform: [
        { translateX: cloudFloat.value * (50 + index * 20) },
        { translateY: Math.sin(cloudFloat.value * Math.PI * 2) * 20 },
      ],
      opacity: 0.3 + cloudFloat.value * 0.4,
    }));
  };

  const getBirdStyle = (index: number) => {
    return useAnimatedStyle(() => ({
      transform: [
        { translateX: birdFly.value * 300 },
        { translateY: Math.sin(birdFly.value * Math.PI * 4) * 30 },
      ],
      opacity: 0.4 + Math.sin(birdFly.value * Math.PI * 8) * 0.3,
    }));
  };

  const getLeafStyle = (index: number) => {
    return useAnimatedStyle(() => ({
      transform: [
        { translateY: leafFall.value * 400 },
        { translateX: Math.sin(leafFall.value * Math.PI * 2) * 100 },
        { rotate: `${leafFall.value * 360}deg` },
      ],
      opacity: 0.5 + Math.sin(leafFall.value * Math.PI * 4) * 0.3,
    }));
  };

  const getSnowStyle = (index: number) => {
    return useAnimatedStyle(() => ({
      transform: [
        { translateY: snowFloat.value * 500 },
        { translateX: Math.sin(snowFloat.value * Math.PI * 3) * 50 },
        { rotate: `${snowFloat.value * 720}deg` },
      ],
      opacity: 0.6 + Math.sin(snowFloat.value * Math.PI * 6) * 0.2,
    }));
  };

  const getRainStyle = (index: number) => {
    return useAnimatedStyle(() => ({
      transform: [
        { translateY: rainDrop.value * 400 },
        { translateX: Math.sin(rainDrop.value * Math.PI * 2) * 20 },
      ],
      opacity: 0.7 + Math.sin(rainDrop.value * Math.PI * 8) * 0.2,
    }));
  };

  const renderClouds = () => {
    if (weatherCode >= 2 && weatherCode <= 3) {
      return Array.from({ length: 3 }).map((_, index) => (
        <Animated.View
          key={`cloud-${index}`}
          style={[
            styles.cloud,
            {
              top: 50 + index * 80,
              left: -100 + index * 50,
            },
            getCloudStyle(index),
          ]}
        />
      ));
    }
    return null;
  };

  const renderBirds = () => {
    if (weatherCode === 0 || weatherCode === 1) {
      return Array.from({ length: 2 }).map((_, index) => (
        <Animated.View
          key={`bird-${index}`}
          style={[
            styles.bird,
            {
              top: 100 + index * 60,
              left: -50 + index * 30,
            },
            getBirdStyle(index),
          ]}
        />
      ));
    }
    return null;
  };

  const renderLeaves = () => {
    const month = new Date().getMonth();
    const isAutumn = month >= 9 && month <= 11;
    
    if (isAutumn && (weatherCode === 0 || weatherCode === 1 || weatherCode === 2)) {
      return Array.from({ length: 5 }).map((_, index) => (
        <Animated.View
          key={`leaf-${index}`}
          style={[
            styles.leaf,
            {
              top: -50 + index * 20,
              left: 50 + index * 60,
            },
            getLeafStyle(index),
          ]}
        />
      ));
    }
    return null;
  };

  const renderSnow = () => {
    if (weatherCode >= 71 && weatherCode <= 77) {
      return Array.from({ length: 20 }).map((_, index) => (
        <Animated.View
          key={`snow-${index}`}
          style={[
            styles.snowflake,
            {
              top: -20 + index * 5,
              left: (index * 5) % 100,
            },
            getSnowStyle(index),
          ]}
        />
      ));
    }
    return null;
  };

  const renderRain = () => {
    if (weatherCode >= 61 && weatherCode <= 65) {
      return Array.from({ length: 25 }).map((_, index) => (
        <Animated.View
          key={`rain-${index}`}
          style={[
            styles.rainDrop,
            {
              top: -30 + index * 3,
              left: (index * 4) % 100,
            },
            getRainStyle(index),
          ]}
        />
      ));
    }
    return null;
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {renderClouds()}
      {renderBirds()}
      {renderLeaves()}
      {renderSnow()}
      {renderRain()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  cloud: {
    position: 'absolute',
    width: 60,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bird: {
    position: 'absolute',
    width: 20,
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  leaf: {
    position: 'absolute',
    width: 12,
    height: 8,
    backgroundColor: 'rgba(255, 165, 0, 0.7)',
    borderRadius: 6,
  },
  snowflake: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 2,
  },
  rainDrop: {
    position: 'absolute',
    width: 1,
    height: 20,
    backgroundColor: 'rgba(135, 206, 235, 0.7)',
    borderRadius: 0.5,
  },
});
