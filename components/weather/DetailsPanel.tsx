import { ThemedText } from '@/components/themed-text';
import { ModernCard } from '@/components/ui/ModernCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  humidity: number;
  windSpeed: number; // km/h
  uvIndex: number;
}

export function DetailsPanel({ humidity, windSpeed, uvIndex }: Props) {
  return (
    <ModernCard variant="elevated" style={styles.container} padding="large" borderRadius="xl">
      <ThemedText type="subtitle" style={styles.title}>Comfort level</ThemedText>
      <View style={styles.row}>
        <View style={styles.item}>
          <IconSymbol name="humidity.fill" size={22} color="#87CEEB" />
          <ThemedText style={styles.value}>{humidity}%</ThemedText>
          <ThemedText style={styles.label}>Humidity</ThemedText>
        </View>
        <View style={styles.item}>
          <IconSymbol name="wind" size={22} color="#87CEEB" />
          <ThemedText style={styles.value}>{Math.round(windSpeed)} km/h</ThemedText>
          <ThemedText style={styles.label}>Wind</ThemedText>
        </View>
        <View style={styles.item}>
          <IconSymbol name="sun.max.fill" size={22} color="#FFD166" />
          <ThemedText style={styles.value}>{uvIndex}</ThemedText>
          <ThemedText style={styles.label}>UV index</ThemedText>
        </View>
      </View>
    </ModernCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  title: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 4,
  },
  label: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 12,
    marginTop: 2,
  },
});


