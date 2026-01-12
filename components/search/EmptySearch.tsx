import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

interface EmptySearchProps {
  loading: boolean;
  error?: string | null;
  hasQueryOrFilters: boolean;
}

export default function EmptySearch({ loading, error, hasQueryOrFilters }: EmptySearchProps) {
  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator animating={true} size="large" color={COLORS.primary} />
        <Text style={styles.emptyText}>Searching...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (hasQueryOrFilters) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search" size={64} color="#D1D5DB" />
        <Text style={styles.emptyText}>No properties found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="search" size={64} color="#D1D5DB" />
      <Text style={styles.emptyText}>Search for properties</Text>
      <Text style={styles.emptySubtext}>Enter a location or use filters</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },
});
