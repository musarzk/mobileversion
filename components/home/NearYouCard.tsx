import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { formatPrice } from '../../utils/formatCurrency';

interface NearYouCardProps {
  property: any;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6;

export default function NearYouCard({ property, onPress }: NearYouCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: Array.isArray(property.images) ? property.images[0] : property.image }} style={styles.image} />

      {/* Rating Badge */}
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={12} color="#FFD700" />
        <Text style={styles.ratingText}>4.8</Text>
      </View>

      {/* Listing Type Badge */}
      <View style={[styles.typeBadge, { backgroundColor: property.listingType === 'sale' ? COLORS.primary : '#10B981' }]}>
        <Text style={styles.typeText}>
          {property.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'}
        </Text>
      </View>

      {/* Overlay Content */}
      <View style={styles.overlay}>
        <View style={styles.overlayContent}>
          <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
          <Text style={styles.address} numberOfLines={1}>{property.location || property.address || 'Location not set'}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceNaira}>₦{formatPrice(property.price)}</Text>
            <Text style={styles.priceDollar}>~${formatPrice(property.price / 1600)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 380, // Taller as per design
    borderRadius: 24,
    marginRight: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: '#1A1D1E',
    fontSize: 12,
    fontWeight: 'bold',
  },
  typeBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.4)', // Slightly darker for text visibility
  },
  overlayContent: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  address: {
    color: '#E5E7EB',
    fontSize: 12,
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceNaira: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceDollar: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
  },
  heartButton: {
    marginBottom: 4,
  },
});
