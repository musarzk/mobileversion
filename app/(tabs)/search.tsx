import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useProperties } from '../../hooks/useProperties';
import PropertyCard from '../../components/properties/PropertyCard';
import FilterModal, { FilterOptions } from '../../components/properties/FilterModal';
import { COLORS } from '../../constants/theme';
import SearchHeader from '../../components/search/SearchHeader';
import EmptySearch from '../../components/search/EmptySearch';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  const { properties, loading, error, hasMore, loadMore } = useProperties({
    ...filters,
    location: searchQuery,
  });

  const handlePropertyPress = (propertyId: string) => {
    // @ts-ignore
    navigation.navigate('PropertyDetails', { id: propertyId });
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const renderProperty = ({ item }: any) => (
    <PropertyCard property={item} onPress={() => handlePropertyPress(item._id)} />
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator animating={true} size="small" color="COLORS.primary" />
      </View>
    );
  };

  const renderEmpty = () => (
    <EmptySearch 
      loading={loading} 
      error={error} 
      hasQueryOrFilters={Boolean(searchQuery || Object.keys(filters).length > 0)} 
    />
  );

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined && v !== '').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <SearchHeader
        title="Search Properties"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        onFilterPress={() => setShowFilters(true)}
        activeFilterCount={activeFilterCount}
        onClearFilters={() => setFilters({})}
      />

      {/* Results */}
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={Boolean(showFilters)}
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
  list: {
    padding: 16,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});


