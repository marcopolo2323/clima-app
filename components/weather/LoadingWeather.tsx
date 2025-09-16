import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface LoadingWeatherProps {
  message?: string;
}

export function LoadingWeather({ message = 'Obteniendo datos del clima...' }: LoadingWeatherProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <IconSymbol
          name="cloud.sun.fill"
          size={60}
          color={colors.tint}
          style={styles.icon}
        />
        <ActivityIndicator
          size="large"
          color={colors.tint}
          style={styles.spinner}
        />
        <ThemedText style={styles.message}>
          {message}
        </ThemedText>
      </View>
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
  },
  icon: {
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});

