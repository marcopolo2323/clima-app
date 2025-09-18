import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function IconTest() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Prueba de Iconos</ThemedText>
      
      <View style={styles.iconRow}>
        <IconSymbol name="magnifyingglass" size={24} color="#007AFF" />
        <ThemedText>Búsqueda</ThemedText>
      </View>
      
      <View style={styles.iconRow}>
        <IconSymbol name="location.fill" size={24} color="#007AFF" />
        <ThemedText>Ubicación</ThemedText>
      </View>
      
      <View style={styles.iconRow}>
        <IconSymbol name="arrow.clockwise" size={24} color="#007AFF" />
        <ThemedText>Actualizar</ThemedText>
      </View>
      
      <View style={styles.iconRow}>
        <IconSymbol name="cloud.sun.fill" size={24} color="#007AFF" />
        <ThemedText>Clima</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
});
