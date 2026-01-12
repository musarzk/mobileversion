import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { formatPrice } from '../../utils/formatCurrency';

interface BestForYouCardProps {
  property: any;
  onPress: () => void;
}

export default function BestForYouCard({ property, onPress }: BestForYouCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.card}>
        <Image source={{ uri: Array.isArray(property.images) ? property.images[0] : property.image }} style={styles.image} />

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>4.8</Text>
        </View>

        {/* Listing Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: property.listingType === 'sale' ? COLORS.primary : '#10B981' }]}>
          <Text style={styles.typeText}>
            {property.listingType === 'sale' ? 'SALE' : 'RENT'}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
          <Text style={styles.address} numberOfLines={1}>{property.location || property.address || 'Location not set'}</Text>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceNaira}>₦{formatPrice(property.price)}</Text>
              <Text style={styles.priceDollar}>~${formatPrice(property.price / 1600)}</Text>
            </View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="heart-outline" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    padding: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 8,
    // Add subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    backgroundColor: COLORS.border,
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  ratingText: {
    color: '#1A1D1E',
    fontSize: 10,
    fontWeight: 'bold',
  },
  typeBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  content: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1D1E',
    marginBottom: 2,
  },
  address: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceNaira: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  priceDollar: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 0,
  },
});
