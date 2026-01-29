import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Property } from '../../types';
import { formatPrice as utilFormatPrice } from '../../utils/formatCurrency';
import { COLORS } from '../../constants/theme';

interface PropertyCardProps {
    property: Property;
    onPress: () => void;
}

export default function PropertyCard({ property, onPress }: PropertyCardProps) {
    const formatCardPrice = (price: number) => {
        return `₦${utilFormatPrice(price)}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return '#05ad75ff';
            case 'pending':
                return '#F59E0B';
            case 'sold':
                return '#EF4444';
            default:
                return '#6B7280';
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {/* Property Image */}
            <View style={styles.imageContainer}>
                {property.images && property.images.length > 0 ? (
                    <Image
                        source={{ uri: property.images[0] }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                )}

                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(property.status) }]}>
                    <Text style={styles.statusText}>{property.status.toUpperCase()}</Text>
                </View>

                {/* Listing Type Badge */}
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>
                        {property.listingType === 'sale' ? 'FOR SALE' : 'FOR RENT'}
                    </Text>
                </View>
            </View>

            {/* Property Details */}
            <View style={styles.content}>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{formatCardPrice(property.price)}</Text>
                    {property.priceUsd ? (
                        <Text style={styles.priceDollar}>/ ${utilFormatPrice(property.priceUsd)}</Text>
                    ) : (
                        <Text style={styles.priceDollar}>~${utilFormatPrice(property.price / 1600)}</Text>
                    )}
                </View>
                <Text style={styles.title} numberOfLines={1}>
                    {property.title}
                </Text>
                <Text style={styles.location} numberOfLines={1}>
                    {property.location}
                </Text>

                {/* Property Specs */}
                <View style={styles.specs}>
                    <View style={styles.spec}>
                        <Text style={styles.specText}>{property.beds} beds</Text>
                    </View>
                    <View style={styles.specDivider} />
                    <View style={styles.spec}>
                        <Text style={styles.specText}>{property.baths} baths</Text>
                    </View>
                    <View style={styles.specDivider} />
                    <View style={styles.spec}>
                        <Text style={styles.specText}>{property.sqft} sqft</Text>
                    </View>
                </View>

                {property.yearBuilt && (
                    <Text style={styles.yearBuilt}>Built in {property.yearBuilt}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#9CA3AF',
        fontSize: 16,
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    typeBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#0096DC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    typeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
    },
    content: {
        padding: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 4,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    priceDollar: {
        fontSize: 16,
        color: '#4B5563',
        fontWeight: '600',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    specs: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    spec: {
        flex: 1,
    },
    specText: {
        fontSize: 14,
        color: '#374151',
    },
    specDivider: {
        width: 1,
        height: 12,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 8,
    },
    yearBuilt: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});
