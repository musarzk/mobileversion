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
import { User } from '../../types';
import { COLORS } from '../../constants/theme';

export default function ManageUsersScreen() {
    const navigation = useNavigation();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data.users || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            Alert.alert('Error', 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user: User) => {
        // This is a mock/example of what an admin might do
        Alert.alert(
            'Manage User',
            `Changing status for ${user.email}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Toggle Active',
                    onPress: () => Alert.alert('Success', 'User status updated')
                }
            ]
        );
    };

    const renderUser = ({ item }: { item: User }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={[styles.roleBadge, { backgroundColor: item.role === 'admin' ? '#FEE2E2' : '#E0E7FF' }]}>
                    <Text style={[styles.roleText, { color: item.role === 'admin' ? '#EF4444' : '#6366F1' }]}>
                        {item.role.toUpperCase()}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleToggleStatus(item)}
            >
                <Ionicons name="ellipsis-vertical" size={24} color="#6B7280" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.title}>Manage Users</Text>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="COLORS.primary" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUser}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text>No users found</Text>
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
    userCard: {
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
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    userEmail: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    roleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginTop: 8,
    },
    roleText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    actionBtn: {
        padding: 8,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
});


