import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../../constants/theme';

export default function InvestScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { id, title, price, roi, minInvestment, image } = (route.params as any) || {};

    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInvest = () => {
        const investAmount = parseInt(amount.replace(/[^0-9]/g, '') || '0');
        const minInvest = parseInt(minInvestment || '0');

        if (!amount || investAmount < minInvest) {
            Alert.alert('Invalid Amount', `Minimum investment is $${minInvest.toLocaleString()}`);
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                'Investment Successful!',
                `You have successfully invested $${investAmount.toLocaleString()} in ${title}.`,
                [
                    { text: 'View Portfolio', onPress: () => navigation.navigate('InvestmentPlan') },
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]
            );
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invest in Property</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Property Summary */}
                <View style={styles.propertyCard}>
                    <Image source={{ uri: image || 'https://via.placeholder.com/400x200' }} style={styles.image} />
                    <View style={styles.cardContent}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>Target ROI</Text>
                                <Text style={[styles.statValue, { color: COLORS.success }]}>{roi}%</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>Min. Invest</Text>
                                <Text style={styles.statValue}>${parseInt(minInvestment).toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Investment Form */}
                <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Investment Amount</Text>
                    <Text style={styles.helperText}>
                        Enter the amount you wish to invest. Minimum is ${parseInt(minInvestment).toLocaleString()}.
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.currencyPrefix}>$</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            placeholderTextColor={COLORS.textMuted}
                        />
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Estimated Annual Return</Text>
                        <Text style={styles.summaryValue}>
                            ${amount ? Math.round(parseInt(amount) * (parseFloat(roi) / 100)).toLocaleString() : '0'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.investButton, loading && styles.disabledButton]}
                        onPress={handleInvest}
                        disabled={loading}
                    >
                        <Text style={styles.investButtonText}>{loading ? 'Processing...' : 'Confirm Investment'}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.disclaimer}>
                    By clicking Confirm, you agree to our Terms of Service and Investment Risks disclosure.
                </Text>
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
    propertyCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
    },
    cardContent: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 24,
    },
    stat: {
        gap: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    formCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    helperText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
        backgroundColor: COLORS.background,
    },
    currencyPrefix: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        marginBottom: 24,
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    investButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    investButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disclaimer: {
        fontSize: 12,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: 40,
    },
});
