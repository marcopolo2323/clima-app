import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { HourlyData } from '@/services/weatherService';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface HourlyForecastProps {
  items: HourlyData[];
}

export function HourlyForecast({ items }: HourlyForecastProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((h) => (
          <View key={h.time} style={[styles.item, { borderColor: colors.surfaceVariant }]}> 
            <ThemedText style={styles.time}>{h.hourLabel}</ThemedText>
            <IconSymbol name={h.icon} size={22} color={colors.icon} />
            <ThemedText style={styles.temp}>{h.temperature}°</ThemedText>
            <ThemedText style={styles.pop}>{h.precipitationProb}%</ThemedText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  item: {
    width: 72,
    height: 96,
    borderRadius: 16,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
  },
  time: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  temp: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pop: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
  },
});


