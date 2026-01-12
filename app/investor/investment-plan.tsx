import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

export default function InvestmentPlanScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Investment Plan</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
                    <Text style={styles.summaryValue}>$124,500</Text>
                    <View style={styles.changeContainer}>
                        <Ionicons name="trending-up" size={16} color={COLORS.success} />
                        <Text style={styles.changeText}>+12.5% this year</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Asset Allocation</Text>
                <View style={styles.allocationCard}>
                    <View style={styles.allocationItem}>
                        <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
                        <Text style={styles.allocationLabel}>Residential</Text>
                        <Text style={styles.allocationValue}>60%</Text>
                    </View>
                    <View style={styles.allocationItem}>
                        <View style={[styles.dot, { backgroundColor: COLORS.secondary }]} />
                        <Text style={styles.allocationLabel}>Commercial</Text>
                        <Text style={styles.allocationValue}>30%</Text>
                    </View>
                    <View style={styles.allocationItem}>
                        <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                        <Text style={styles.allocationLabel}>Industrial</Text>
                        <Text style={styles.allocationValue}>10%</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Projected Growth</Text>
                <View style={styles.chartPlaceholder}>
                    <Text style={styles.placeholderText}>Growth Chart Placeholder</Text>
                </View>

                <Text style={styles.sectionTitle}>My Investments</Text>
                <View style={styles.investmentsList}>
                    {[
                        { id: 1, title: 'Modern Apartment Complex', amount: 25000, roi: 12.5, date: '2023-12-15' },
                        { id: 2, title: 'Downtown Commercial Hub', amount: 50000, roi: 14.2, date: '2024-01-10' },
                    ].map((inv) => (
                        <View key={inv.id} style={styles.investmentCard}>
                            <View style={styles.investmentHeader}>
                                <Text style={styles.investmentTitle}>{inv.title}</Text>
                                <Text style={styles.investmentAmount}>${inv.amount.toLocaleString()}</Text>
                            </View>
                            <View style={styles.investmentFooter}>
                                <Text style={styles.investmentDate}>{inv.date}</Text>
                                <Text style={styles.investmentRoi}>{inv.roi}% ROI</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Rebalance Portfolio</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.card,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: 20,
    },
    summaryCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DEF7EC',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    changeText: {
        color: COLORS.success,
        fontWeight: '600',
        fontSize: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
    allocationCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    allocationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    allocationLabel: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    allocationValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    chartPlaceholder: {
        height: 200,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
    },
    placeholderText: {
        color: COLORS.textMuted,
    },
    actionButton: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    investmentsList: {
        marginBottom: 24,
    },
    investmentCard: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    investmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    investmentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
        marginRight: 8,
    },
    investmentAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    investmentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    investmentDate: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    investmentRoi: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.success,
    },
});

