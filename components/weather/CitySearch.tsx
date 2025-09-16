import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WeatherService, LocationData } from '@/services/weatherService';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface CitySearchProps {
  onLocationSelect: (location: LocationData) => void;
  onClose: () => void;
}

export function CitySearch({ onLocationSelect, onClose }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (query.length >= 2) {
      searchCities();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const cities = await WeatherService.searchLocation(query);
      setResults(cities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar ciudades');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    onLocationSelect(location);
    onClose();
  };

  const renderCityItem = ({ item }: { item: LocationData }) => (
    <TouchableOpacity
      style={styles.cityItem}
      onPress={() => handleLocationSelect(item)}
    >
      <IconSymbol name="location.fill" size={20} color={colors.icon} />
      <View style={styles.cityInfo}>
        <ThemedText style={styles.cityName}>{item.name}</ThemedText>
        <ThemedText style={styles.countryName}>{item.country}</ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={16} color={colors.icon} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Buscar Ciudad
        </ThemedText>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <IconSymbol name="xmark" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Escribe el nombre de la ciudad..."
          placeholderTextColor={colors.icon}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {loading && <ActivityIndicator size="small" color={colors.tint} />}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={20} color="#FF6B6B" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.latitude}-${item.longitude}-${index}`}
        renderItem={renderCityItem}
        style={styles.resultsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          query.length >= 2 && !loading ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="magnifyingglass" size={40} color={colors.icon} />
              <ThemedText style={styles.emptyText}>
                No se encontraron ciudades
              </ThemedText>
            </View>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF6B6B',
    marginLeft: 8,
    flex: 1,
  },
  resultsList: {
    flex: 1,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    marginBottom: 8,
  },
  cityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  countryName: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    opacity: 0.7,
  },
});

