import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSavedProperties } from '../../hooks/useSavedProperties';
import PropertyCard from '../../components/properties/PropertyCard';
import { COLORS } from '../../constants/theme';

export default function SavedScreen() {
  const navigation = useNavigation();
  const { savedProperties, loading, error, refresh } = useSavedProperties();

  const handlePropertyPress = (propertyId: string) => {
    // @ts-ignore
    navigation.navigate('PropertyDetails', { id: propertyId });
  };

  const renderProperty = ({ item }: any) => (
    <PropertyCard
      property={item}
      onPress={() => handlePropertyPress(item._id)}
    />
  );

  const renderEmpty = () => {
    if (loading && savedProperties.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator animating={true} size="large" color="COLORS.primary" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyText}>No saved properties yet</Text>
        <Text style={styles.emptySubtext}>Properties you save will appear here</Text>
        <TouchableOpacity 
          style={styles.browseButton} 
          onPress={() => navigation.navigate('Home' as never)}
        >
          <Text style={styles.browseButtonText}>Browse Properties</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Properties</Text>
      </View>
      
      <FlatList
        data={savedProperties}
        renderItem={renderProperty}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={Boolean(loading && savedProperties.length > 0)}
            onRefresh={refresh}
            tintColor="COLORS.primary"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});


