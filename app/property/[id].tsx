import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Animated,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import api from '../../services/api';
import { Property } from '../../types';
import ImageGalleryModal from '../../components/properties/ImageGalleryModal';
import { formatPrice } from '../../utils/formatCurrency';

const { width } = Dimensions.get('window');

export default function PropertyDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  // @ts-ignore
  const { id } = route.params;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeAction, setActiveAction] = useState<'contact' | 'book'>('book');
  const [galleryVisible, setGalleryVisible] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Header background opacity
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Header title opacity (fade in title only when scrolled)
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [150, 250],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Header Y translation for "hidable" effect on deep scroll
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 300, 301], // Wait until 300 scroll to start potentially hiding logic if we wanted, 
    // but for "hidable" let's just use diffClamp if we want true "hide on scroll down".
    // For now, let's stick to "Transparent -> White" overlay as suggested by user request "stop covering too much part".
    // Making it transparent implies it doesn't cover the image visually.
    outputRange: [0, 0, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/properties/${id}`);

      if (response.data.success) {
        setProperty(response.data.property);
      } else {
        setError(response.data.message || 'Failed to load property');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load property');
    } finally {
      setLoading(false);
    }


  };

  const handleContactAgent = () => {
    setActiveAction('contact');
    if (property?.agent?.phone) {
      Linking.openURL(`tel:${property.agent.phone}`);
    } else if (property?.agent?.email) {
      Linking.openURL(`mailto:${property.agent.email}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#0096DC" />
        <Text style={styles.loadingText}>Loading property...</Text>
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Property not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { backgroundColor: 'white', opacity: headerOpacity }]} />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
          Property Details
        </Animated.Text>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="heart-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={[styles.content, { marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 44 }]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="never"
      >
        {/* Image Gallery */}
        {property.images && property.images.length > 0 ? (
          <View style={styles.imageGallery}>
            <ScrollView
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {property.images.map((image, index) => (
                <TouchableOpacity 
                  key={index} 
                  activeOpacity={0.9} 
                  onPress={() => setGalleryVisible(true)}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.propertyImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.imagePagination}>
              <Text style={styles.paginationText}>
                {currentImageIndex + 1} / {property.images.length}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Images Available</Text>
          </View>
        )}

        {/* Property Info */}
        <View style={[styles.infoSection, { 
          paddingLeft: 20 + insets.left, 
          paddingRight: 20 + insets.right,
          paddingBottom: Math.max(20, insets.bottom) // Ensure bottom padding doesn't go below 20
        }]}>
          <View style={styles.priceRow}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.price}>₦{formatPrice(property.price)}</Text>
              {property.priceUsd && (
                <Text style={styles.priceUsd}> / ${formatPrice(property.priceUsd)}</Text>
              )}
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{property.status.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#6B7280" />
            <Text style={styles.locationText}>
              {property.address ? `${property.address}, ` : ''}{property.location}
            </Text>
          </View>

          {/* Specs */}
          <View style={styles.specs}>
            <View style={styles.specItem}>
              <Ionicons name="bed" size={20} color="#0096DC" />
              <Text style={styles.specText}>{property.bedrooms || property.beds || 0} Beds</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="water" size={20} color="#0096DC" />
              <Text style={styles.specText}>{property.bathrooms || property.baths || 0} Baths</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="resize" size={20} color="#0096DC" />
              <Text style={styles.specText}>{property.sqft || 0} sqft</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={[styles.description, { textAlign: 'justify' }]}>{property.description}</Text>
          </View>

          {/* Property Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>{property.propertyType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Listing Type:</Text>
              <Text style={styles.detailValue}>
                {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
              </Text>
            </View>
            {property.yearBuilt && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Year Built:</Text>
                <Text style={styles.detailValue}>{property.yearBuilt}</Text>
              </View>
            )}
          </View>

          {/* Agent Info */}
          {property.agent && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Listed By</Text>
              <View style={styles.agentCard}>
                <View style={styles.agentAvatar}>
                  <Text style={styles.agentAvatarText}>
                    {property.agent.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.agentInfo}>
                  <Text style={styles.agentName}>{property.agent.name}</Text>
                  <Text style={styles.agentRole}>{property.agent.role}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Contact Button */}
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <View style={[styles.footerContent, {
          paddingLeft: 16 + insets.left,
          paddingRight: 16 + insets.right,
        }]}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              activeAction === 'contact' ? styles.primaryButton : styles.secondaryButton
            ]} 
            onPress={handleContactAgent}
          >
            <Ionicons 
              name="call-outline" 
              size={20} 
              color={activeAction === 'contact' ? '#FFFFFF' : '#0096DC'} 
            />
            <Text 
              style={[
                styles.actionButtonText, 
                { color: activeAction === 'contact' ? '#FFFFFF' : '#0096DC' }
              ]}
            >
              Contact Agent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.actionButton, 
              activeAction === 'book' ? styles.primaryButton : styles.secondaryButton
            ]} 
            onPress={() => setActiveAction('book')}
          >
            <Ionicons 
              name="calendar-outline" 
              size={20} 
              color={activeAction === 'book' ? '#FFFFFF' : '#0096DC'} 
            />
            <Text 
              style={[
                styles.actionButtonText, 
                { color: activeAction === 'book' ? '#FFFFFF' : '#0096DC' }
              ]}
            >
              Book Inspect
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Full Screen Image Gallery */}
      <ImageGalleryModal
        visible={galleryVisible}
        images={property?.images || []}
        initialIndex={currentImageIndex}
        onClose={() => setGalleryVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90, // Covers likely height of header
    zIndex: 9,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 50,
    paddingBottom: 10,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  imageGallery: {
    position: 'relative',
  },
  propertyImage: {
    width: width,
    height: 300,
  },
  placeholderImage: {
    width: width,
    height: 300,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  imagePagination: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paginationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    padding: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0096DC',
  },
  priceUsd: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: '#0096DC',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#6B7280',
  },
  specs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 24,
  },
  specItem: {
    alignItems: 'center',
  },
  specText: {
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  agentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0096DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  agentRole: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#0096DC',
    borderColor: '#0096DC',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0096DC',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#0096DC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
