import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { Property } from '../../types';
import { COLORS } from '../../constants/theme';

export default function ManagePropertiesScreen() {
  const navigation = useNavigation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/properties');
      setProperties(response.data.properties || []);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await api.put(`/properties/approval/${id}`, { verified: true });
      if (response.data.success) {
        Alert.alert('Success', 'Property approved successfully');
        fetchProperties(); // Refresh
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to approve property');
    }
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <View style={styles.propertyCard}>
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle}>{item.title}</Text>
        <Text style={styles.propertyLocation}>{item.location}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: item.verified ? '#D1FAE5' : '#FEF3C7' }]}>
            <Text style={[styles.statusText, { color: item.verified ? '#10B981' : '#F59E0B' }]}>
              {item.verified ? 'VERIFIED' : 'PENDING'}
            </Text>
          </View>
          <Text style={styles.price}>₦{item.price.toLocaleString()}</Text>
        </View>
      </View>
      {!item.verified && (
        <TouchableOpacity 
          style={styles.approveBtn}
          onPress={() => handleApprove(item._id)}
        >
          <Text style={styles.approveBtnText}>Approve</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Properties</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="COLORS.primary" />
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderProperty}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No properties found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  list: {
    padding: 16,
  },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  propertyLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  approveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});


