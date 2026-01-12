import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  listingType?: 'sale' | 'rent' | '';
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export default function FilterModal({
  visible,
  onClose,
  onApply,
  initialFilters = {},
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
    onApply({});
    onClose();
  };

  return (
    <Modal 
      visible={visible === true} 
      animationType="slide" 
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Listing Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Listing Type</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filters.listingType === 'sale' ? styles.filterButtonActive : {},
                  ]}
                  onPress={() => setFilters({ ...filters, listingType: 'sale' })}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filters.listingType === 'sale' ? styles.filterButtonTextActive : {},
                    ]}
                  >
                    For Sale
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filters.listingType === 'rent' ? styles.filterButtonActive : {},
                  ]}
                  onPress={() => setFilters({ ...filters, listingType: 'rent' })}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filters.listingType === 'rent' ? styles.filterButtonTextActive : {},
                    ]}
                  >
                    For Rent
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Property Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Property Type</Text>
              <View style={styles.buttonGroup}>
                {['house', 'apartment', 'condo', 'townhouse'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterButton,
                      filters.propertyType === type ? styles.filterButtonActive : {},
                    ]}
                    onPress={() => setFilters({ ...filters, propertyType: type })}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        filters.propertyType === type ? styles.filterButtonTextActive : {},
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceInputs}>
                <View style={styles.priceInput}>
                  <Text style={styles.inputLabel}>Min Price</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="$0"
                    keyboardType="numeric"
                    value={filters.minPrice?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseInt(text);
                      setFilters({ ...filters, minPrice: isNaN(num) ? undefined : num });
                    }}
                  />
                </View>
                <Text style={styles.priceSeparator}>-</Text>
                <View style={styles.priceInput}>
                  <Text style={styles.inputLabel}>Max Price</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Any"
                    keyboardType="numeric"
                    value={filters.maxPrice?.toString() || ''}
                    onChangeText={(text) => {
                      const num = parseInt(text);
                      setFilters({ ...filters, maxPrice: isNaN(num) ? undefined : num });
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Bedrooms */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bedrooms</Text>
              <View style={styles.buttonGroup}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberButton,
                      filters.bedrooms === num ? styles.filterButtonActive : {},
                    ]}
                    onPress={() => setFilters({ ...filters, bedrooms: num })}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        filters.bedrooms === num ? styles.filterButtonTextActive : {},
                      ]}
                    >
                      {num}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bathrooms */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bathrooms</Text>
              <View style={styles.buttonGroup}>
                {[1, 2, 3, 4].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.numberButton,
                      filters.bathrooms === num ? styles.filterButtonActive : {},
                    ]}
                    onPress={() => setFilters({ ...filters, bathrooms: num })}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        filters.bathrooms === num ? styles.filterButtonTextActive : {},
                      ]}
                    >
                      {num}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  clearText: {
    fontSize: 16,
    color: '#0096DC',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  filterButtonActive: {
    backgroundColor: '#0096DC',
    borderColor: '#0096DC',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  numberButton: {
    width: 60,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  priceSeparator: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#0096DC',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
