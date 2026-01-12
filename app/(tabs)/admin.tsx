import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { COLORS } from '../../constants/theme';

export default function AdminScreen() {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingApprovals: 0,
    activeListings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch dashboard stats
      const [usersRes, propertiesRes] = await Promise.all([
        api.get('/users'),
        api.get('/properties'),
      ]);

      const users = usersRes.data.users || [];
      const properties = propertiesRes.data.properties || [];

      setStats({
        totalUsers: users.length,
        totalProperties: properties.length,
        pendingApprovals: properties.filter((p: any) => !p.verified).length,
        activeListings: properties.filter((p: any) => p.status === 'active').length,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="COLORS.primary" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your platform</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
          <Ionicons name="people" size={32} color="COLORS.primary" />
          <Text style={styles.statValue}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
          <Ionicons name="home" size={32} color="#10B981" />
          <Text style={styles.statValue}>{stats.totalProperties}</Text>
          <Text style={styles.statLabel}>Properties</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
          <Ionicons name="time" size={32} color="#F59E0B" />
          <Text style={styles.statValue}>{stats.pendingApprovals}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#E0E7FF' }]}>
          <Ionicons name="checkmark-circle" size={32} color="#6366F1" />
          <Text style={styles.statValue}>{stats.activeListings}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('ManageUsers' as never)}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="people" size={24} color="COLORS.primary" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Users</Text>
            <Text style={styles.actionSubtitle}>View and manage all users</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('ManageProperties' as never)}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="home" size={24} color="#10B981" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Properties</Text>
            <Text style={styles.actionSubtitle}>Review and approve listings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Ionicons name="stats-chart" size={24} color="#6366F1" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>View Analytics</Text>
            <Text style={styles.actionSubtitle}>Platform insights and metrics</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  actionCard: {
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});


