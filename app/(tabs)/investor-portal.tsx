import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { fetchInvestorProperties } from '../../services/api';

// Theme Colors
import { COLORS } from '../../constants/theme';

export default function InvestorPortalScreen() {
    const navigation = useNavigation<any>();
    const { user } = useAuth();
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRisk, setFilterRisk] = useState<string | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            setLoading(true);
            const data = await fetchInvestorProperties();
            setProperties(data);
        } catch (error) {
            console.error('Failed to load investor properties', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProperties = filterRisk
        ? properties.filter((p: any) => p.riskLevel === filterRisk)
        : properties;

    const handleInvestPress = (item: any) => {
        if (!user) {
            setShowLoginPrompt(true);
        } else {
            navigation.navigate('Invest', {
                id: item._id,
                title: item.title,
                price: item.price,
                roi: item.expectedROI,
                minInvestment: item.minInvestment,
                image: item.images[0]
            });
        }
    };



    const renderStatCard = (title: string, value: string, icon: any, color: string) => (
        <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
    );

    const renderPropertyCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.propertyCard}
            onPress={() => navigation.navigate('PropertyDetails', { id: item._id })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
                <View style={styles.roiBadge}>
                    <Text style={styles.roiText}>{item.expectedROI}% ROI</Text>
                </View>
                {item.verified && (
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                )}
            </View>

            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={[styles.riskBadge, {
                        backgroundColor: item.riskLevel === 'Low' ? '#DEF7EC' : item.riskLevel === 'High' ? '#FDE8E8' : '#FEF3C7'
                    }]}>
                        <Text style={[styles.riskText, {
                            color: item.riskLevel === 'Low' ? '#03543F' : item.riskLevel === 'High' ? '#9B1C1C' : '#92400E'
                        }]}>
                            {item.riskLevel} Risk
                        </Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
                    <Text style={styles.propertyAddress} numberOfLines={1}>
                        {item.address}, {item.city}
                    </Text>
                </View>

                <View style={styles.metricsGrid}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Total Value</Text>
                        <Text style={styles.metricValue}>${(item.price / 1000).toFixed(0)}k</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Min. Invest</Text>
                        <Text style={styles.metricValue}>${(item.minInvestment / 1000).toFixed(1)}k</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Breakeven</Text>
                        <Text style={styles.metricValue}>{item.yearsToBreakeven} yrs</Text>
                    </View>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Investors</Text>
                        <Text style={styles.metricValue}>{item.investors}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.investButton}
                    onPress={() => handleInvestPress(item)}
                >
                    <Text style={styles.investButtonText}>Invest Now</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Investor Portal</Text>
                {!user && (
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Log In</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
            >
                {/* Stats Section */}
                <View style={styles.statsRow}>
                    {renderStatCard('Avg. ROI', '12.5%', 'trending-up', COLORS.success)}
                    {renderStatCard('Active Deals', '24', 'briefcase', COLORS.primary)}
                    {renderStatCard('Investors', '1.2k', 'people', '#8B5CF6')}
                </View>

                {/* Filters */}
                <View style={styles.filterContainer}>
                    <Text style={styles.sectionTitle}>Investment Opportunities</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                        {['All', 'Low', 'Moderate', 'High'].map((risk) => (
                            <TouchableOpacity
                                key={risk}
                                style={[
                                    styles.filterChip,
                                    (risk === 'All' && !filterRisk) || risk === filterRisk ? styles.activeFilter : null
                                ]}
                                onPress={() => setFilterRisk(risk === 'All' ? null : risk)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    (risk === 'All' && !filterRisk) || risk === filterRisk ? styles.activeFilterText : null
                                ]}>
                                    {risk === 'All' ? 'All Risks' : `${risk} Risk`}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Property List */}
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
                ) : (
                    <View style={styles.listContainer}>
                        {filteredProperties.length > 0 ? (
                            filteredProperties.map(item => (
                                <View key={item._id} style={{ marginBottom: 16 }}>
                                    {renderPropertyCard({ item })}
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
                                <Text style={styles.emptyStateText}>No investment properties found.</Text>
                                <TouchableOpacity onPress={loadProperties} style={styles.retryButton}>
                                    <Text style={styles.retryButtonText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Login Prompt Modal */}
            <Modal
                visible={showLoginPrompt}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLoginPrompt(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Ionicons name="lock-closed" size={48} color={COLORS.primary} />
                        <Text style={styles.modalTitle}>Authentication Required</Text>
                         <Text style={styles.modalText}>
                            You need to be logged in to start investing. Create an account or sign in to access exclusive opportunities.
                        </Text>
                        <TouchableOpacity 
                            style={styles.modalButton} 
                            onPress={() => {
                                setShowLoginPrompt(false);
                                navigation.navigate('Login');
                            }}
                        >
                            <Text style={styles.modalButtonText}>Log In / Sign Up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalClose} onPress={() => setShowLoginPrompt(false)}>
                            <Text style={styles.modalCloseText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    loginLink: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    statCard: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 12,
        width: '31%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statTitle: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    filterContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    filterScroll: {
        flexGrow: 0,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 8,
    },
    activeFilter: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#FFFFFF',
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    propertyCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 4,
    },
    imageContainer: {
        position: 'relative',
        height: 180,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    roiBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#33CC33',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    roiText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    verifiedBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    verifiedText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    propertyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
        marginRight: 8,
    },
    riskBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    riskText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 4,
    },
    propertyAddress: {
        fontSize: 14,
        color: COLORS.textMuted,
        flex: 1,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        gap: 12,
    },
    metricItem: {
        width: '47%', // Approx 2 columns
    },
    metricLabel: {
        fontSize: 11,
        color: COLORS.textMuted,
        marginBottom: 2,
    },
    metricValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    investButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    investButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 16,
        marginBottom: 8,
    },
    modalText: {
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    modalButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalClose: {
        padding: 8,
    },
    modalCloseText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textMuted,
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    retryButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
});

