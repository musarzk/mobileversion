import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProperties } from '../../hooks/useProperties';
import PropertyCard from '../../components/properties/PropertyCard';
import FilterModal, { FilterOptions } from '../../components/properties/FilterModal';
import { COLORS } from '../../constants/theme';
import SearchHeader from '../../components/search/SearchHeader';
import EmptySearch from '../../components/search/EmptySearch';
import CategoryList from '../../components/home/CategoryList';

type RootStackParamList = {
  PropertyDetails: { id: string };
};

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    properties,
    loading,
    error,
    hasMore,
    loadMore,
  } = useProperties({
    ...filters,
    location: debouncedQuery,
    category: selectedCategory === 'All' ? undefined : selectedCategory,
  });

  const handlePropertyPress = useCallback(
    (propertyId: string) => {
      navigation.navigate('PropertyDetails', { id: propertyId });
    },
    [navigation]
  );

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    Keyboard.dismiss();
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '' && v !== false && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 5 }]}>
      <View style={styles.stickyHeader}>
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={handleClearSearch}
          onFilterPress={() => setShowFilters(true)}
          activeFilterCount={activeFilterCount}
          showHomeButton={true}
        />
        <View style={{ marginTop: -10, marginBottom: 5 }}>
          <CategoryList 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>
      </View>

      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => handlePropertyPress(item._id)}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onEndReached={() => {
          if (!loading && hasMore) loadMore();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && hasMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptySearch
            loading={loading}
            error={error}
            hasQueryOrFilters={Boolean(searchQuery || activeFilterCount > 0)}
          />
        }
      />

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  stickyHeader: {
    backgroundColor: '#F9FAFB',
    paddingBottom: 10,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});