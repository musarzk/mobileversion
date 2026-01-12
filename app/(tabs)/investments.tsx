import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export default function InvestmentsScreen() {
  // Mock data - in real app, fetch from API
  const portfolioValue = 2500000;
  const totalROI = 12.5;
  const investments = 5;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Investments</Text>
        <Text style={styles.headerSubtitle}>Portfolio Overview</Text>
      </View>

      {/* Portfolio Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
        <Text style={styles.summaryValue}>${portfolioValue.toLocaleString()}</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>ROI</Text>
            <Text style={[styles.summaryItemValue, { color: '#10B981' }]}>
              +{totalROI}%
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Properties</Text>
            <Text style={styles.summaryItemValue}>{investments}</Text>
          </View>
        </View>
      </View>

      {/* Investment List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Investments</Text>

        <View style={styles.investmentCard}>
          <View style={styles.investmentHeader}>
            <Ionicons name="home" size={24} color="COLORS.primary" />
            <View style={styles.investmentInfo}>
              <Text style={styles.investmentTitle}>Downtown Apartment</Text>
              <Text style={styles.investmentLocation}>New York, NY</Text>
            </View>
          </View>
          <View style={styles.investmentStats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Investment</Text>
              <Text style={styles.statValue}>$500,000</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>ROI</Text>
              <Text style={[styles.statValue, { color: '#10B981' }]}>+15%</Text>
            </View>
          </View>
        </View>

        <View style={styles.placeholderContainer}>
          <Ionicons name="trending-up" size={64} color="#D1D5DB" />
          <Text style={styles.placeholderText}>More investments coming soon</Text>
          <Text style={styles.placeholderSubtext}>
            Full investment tracking will be available in the next update
          </Text>
        </View>
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
  summaryCard: {
    backgroundColor: COLORS.primary,
    margin: 16,
    padding: 24,
    borderRadius: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#DBEAFE',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 24,
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemLabel: {
    fontSize: 12,
    color: '#DBEAFE',
    marginBottom: 4,
  },
  summaryItemValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  investmentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  investmentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  investmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  investmentLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  investmentStats: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});


