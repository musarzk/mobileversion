import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../hooks/useProperties';
import CategoryList from '../../components/home/CategoryList';
import NearYouCard from '../../components/home/NearYouCard';
import BestForYouCard from '../../components/home/BestForYouCard';
import { COLORS } from '../../constants/theme';
import HomeHeader from '../../components/home/HomeHeader';
import SectionHeader from '../../components/ui/SectionHeader';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { properties, loading, refresh } = useProperties({ limit: 10 });
  const [selectedCategory, setSelectedCategory] = useState('House');
  const [searchQuery, setSearchQuery] = useState('');

  const handlePropertyPress = (propertyId: string) => {
    // @ts-ignore
    navigation.navigate('PropertyDetails', { id: propertyId });
  };

  // Mock filtering for "Near You" vs "Best For You"
  // In a real app, this would be API driven
  // "Near You" -> Featured: Verified properties, sorted by newest
  const nearYouProperties = React.useMemo(() => {
    let result = [...properties];
    // Prioritize verified
    result.sort((a, b) => {
      if (a.verified === b.verified) {
        // If verify status is same, sort by newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.verified ? -1 : 1;
    });
    return result.slice(0, 5);
  }, [properties]);

  // "Best For You" -> Recommendation: Remaining properties, sorted by lowest price
  const bestForYouProperties = React.useMemo(() => {
    // Get properties NOT in the top "Featured" list to vary content
    const featuredIds = new Set(nearYouProperties.map(p => p._id));
    let result = properties.filter(p => !featuredIds.has(p._id));

    // If we have too few remaining, just use all properties to ensure this section isn't empty
    if (result.length < 2) {
      result = [...properties];
    }
    
    // Sort by price (Low -> High) simulating "Best Deals"
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
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <HomeHeader />

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search something"
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="options-outline" size={20} color={COLORS.textMuted} />
            </View>
          </View>

          {/* Categories */}
          <CategoryList
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Featured Section */}
          <SectionHeader 
            title="Featured" 
            onAction={() => {}} 
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
            onAction={() => {}} 
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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

  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA', // Lighter background for search
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
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

