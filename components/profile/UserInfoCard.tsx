import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

interface UserInfoCardProps {
    name: string;
    email: string;
    role: string;
}

export default function UserInfoCard({ name, email, role }: UserInfoCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {name?.charAt(0).toUpperCase()}
                    </Text>
                </View>
            </View>

            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>

            <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{role?.toUpperCase()}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: COLORS.textMuted,
        marginBottom: 12,
    },
    roleBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
    },
});
