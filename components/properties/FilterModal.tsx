'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/** * 1. EXPORT THE INTERFACE
 * This allows SearchScreen to import { FilterOptions }
 */
export interface FilterOptions {
  listingType?: 'sale' | 'rent';
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export default function FilterModal({
  visible,
  onClose,
  onApply,
  initialFilters = {}
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  // Sync state when modal opens
  useEffect(() => {
    if (visible) setFilters(initialFilters);
  }, [visible, initialFilters]);

  const handlePriceChange = (key: 'minPrice' | 'maxPrice', value: string) => {
    const num = value === '' ? undefined : Number(value.replace(/[^0-9]/g, ''));
    setFilters({ ...filters, [key]: num });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            {/* inner TouchableWithoutFeedback prevents clicks on the sheet from closing the modal */}
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                {/* HEADER */}
                <View style={styles.header}>
                  <TouchableOpacity onPress={onClose} hitSlop={10}>
                    <Ionicons name="close" size={24} color="#374151" />
                  </TouchableOpacity>
                  <Text style={styles.title}>Filters</Text>
                  <TouchableOpacity onPress={() => setFilters({})}>
                    <Text style={styles.reset}>Reset</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
                  {/* LISTING TYPE SECTION */}
                  <View style={styles.section}>
                    <Text style={styles.label}>Listing Type</Text>
                    <View style={styles.row}>
                      {['sale', 'rent'].map((type) => (
                        <TouchableOpacity
                          key={type}
                          onPress={() => setFilters({
                            ...filters,
                            listingType: filters.listingType === type ? undefined : type as any
                          })}
                          style={[
                            styles.chip,
                            filters.listingType === type && styles.activeChip
                          ]}
                        >
                          <Text style={[
                            styles.chipText,
                            filters.listingType === type && styles.activeChipText
                          ]}>
                            For {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* PRICE RANGE SECTION */}
                  <View style={styles.section}>
                    <Text style={styles.label}>Price Range</Text>
                    <View style={styles.row}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Min</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="₦ 0"
                          keyboardType="numeric"
                          value={filters.minPrice?.toString() || ''}
                          onChangeText={(v) => handlePriceChange('minPrice', v)}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Max</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="₦ Any"
                          keyboardType="numeric"
                          value={filters.maxPrice?.toString() || ''}
                          onChangeText={(v) => handlePriceChange('maxPrice', v)}
                        />
                      </View>
                    </View>
                  </View>

                  {/* BEDS & BATHS SECTION */}
                  <View style={styles.section}>
                    <Text style={styles.label}>Rooms</Text>
                    <View style={{ gap: 16 }}>
                      <View>
                        <Text style={styles.subLabel}>Bedrooms</Text>
                        <View style={styles.row}>
                          {[1, 2, 3, 4, '5+'].map((count) => {
                            const value = count === '5+' ? 5 : count as number;
                            return (
                              <TouchableOpacity
                                key={count}
                                onPress={() => setFilters({ ...filters, beds: filters.beds === value ? undefined : value })}
                                style={[
                                  styles.miniChip,
                                  filters.beds === value && styles.activeChip
                                ]}
                              >
                                <Text style={[
                                  styles.miniChipText,
                                  filters.beds === value && styles.activeChipText
                                ]}>
                                  {count}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>

                      <View>
                        <Text style={styles.subLabel}>Bathrooms</Text>
                        <View style={styles.row}>
                          {[1, 2, 3, 4, '5+'].map((count) => {
                            const value = count === '5+' ? 5 : count as number;
                            return (
                              <TouchableOpacity
                                key={count}
                                onPress={() => setFilters({ ...filters, baths: filters.baths === value ? undefined : value })}
                                style={[
                                  styles.miniChip,
                                  filters.baths === value && styles.activeChip
                                ]}
                              >
                                <Text style={[
                                  styles.miniChipText,
                                  filters.baths === value && styles.activeChipText
                                ]}>
                                  {count}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                {/* APPLY BUTTON */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={styles.apply}
                    onPress={() => { onApply(filters); onClose(); }}
                  >
                    <Text style={styles.applyText}>Apply Filters</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6'
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  reset: { color: '#0096DC', fontWeight: '600' },
  body: {
    padding: 20,
  },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '700', marginBottom: 16, color: '#111827' },
  subLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#6B7280' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  miniChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    minWidth: 50,
  },
  activeChip: {
    backgroundColor: '#0096DC',
    borderColor: '#0096DC',
  },
  chipText: { color: '#4B5563', fontWeight: '500' },
  miniChipText: { color: '#4B5563', fontWeight: '500', fontSize: 14 },
  activeChipText: { color: '#FFFFFF', fontWeight: '600' },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#111827'
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  apply: {
    backgroundColor: '#0096DC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});
