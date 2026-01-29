import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../hooks/useProperties';
import CategoryList from '../../components/home/CategoryList';
import NearYouCard from '../../components/home/NearYouCard';
import BestForYouCard from '../../components/home/BestForYouCard';
import { COLORS } from '../../constants/theme';
import HomeHeader from '../../components/home/HomeHeader';
import SectionHeader from '../../components/ui/SectionHeader';
import SearchHeader from '../../components/search/SearchHeader';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { properties, loading, refresh } = useProperties({
    limit: 10,
    category: selectedCategory === 'All' ? '' : selectedCategory
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handlePropertyPress = (propertyId: string) => {
    // @ts-ignore
    navigation.navigate('PropertyDetails', { id: propertyId });
  };

  const nearYouProperties = React.useMemo(() => {
    let result = [...properties];
    result.sort((a, b) => {
      if (a.verified === b.verified) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.verified ? -1 : 1;
    });
    return result.slice(0, 5);
  }, [properties]);

  const bestForYouProperties = React.useMemo(() => {
    const featuredIds = new Set(nearYouProperties.map(p => p._id));
    let result = properties.filter(p => !featuredIds.has(p._id));
    if (result.length < 2) {
      result = [...properties];
    }
    result.sort((a, b) => a.price - b.price);
    return result.slice(0, 5);
  }, [properties, nearYouProperties]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {loading && properties.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading properties...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Sticky Header Section */}
          <View style={styles.headerContainer}>
            <HomeHeader greeting={`Welcome, ${user?.name || 'Friend'}`} />

            <SearchHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearSearch={() => setSearchQuery('')}
              onFilterPress={() => {
                // @ts-ignore
                navigation.navigate('Search');
              }}
              activeFilterCount={0}
            />

            {/* Categories (Moved here to be sticky as well) */}
            <View style={{ marginTop: 5 }}>
              <CategoryList
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refresh} />
            }
          >
            {/* Featured Section */}
            <SectionHeader
              title="Featured"
              onAction={() => { }}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {nearYouProperties.map((property) => (
                <NearYouCard
                  key={property._id}
                  property={property}
                  onPress={() => handlePropertyPress(property._id)}
                />
              ))}
            </ScrollView>

            {/* Our Recommendation Section */}
            <SectionHeader
              title="Our Recommendation"
              onAction={() => { }}
            />

            <View style={styles.verticalList}>
              {bestForYouProperties.map((property) => (
                <BestForYouCard
                  key={property._id}
                  property={property}
                  onPress={() => handlePropertyPress(property._id)}
                />
              ))}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.background,
    paddingBottom: 10,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    // Slight shadow for separation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textMuted,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  verticalList: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
