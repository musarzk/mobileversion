import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

const MOCK_MESSAGES = [
  {
    id: '1',
    name: 'Sarah Agent',
    lastMessage: 'Hi, is the property at 123 Main St still available?',
    time: '2m ago',
    unread: 2,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '2',
    name: 'John Investor',
    lastMessage: 'I sent the documents you requested.',
    time: '1h ago',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: '3',
    name: 'Dweller Support',
    lastMessage: 'Your account has been verified.',
    time: '1d ago',
    unread: 0,
    avatar: 'https://ui-avatars.com/api/?name=Dweller+Support&background=07648f&color=fff',
  },
];

export default function MessagesScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.messageItem}
      onPress={() => router.push({ pathname: '/messages/[id]', params: { id: item.id, name: item.name } })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <FlatList
        data={MOCK_MESSAGES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    padding: 0,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.border,
  },
  messageContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  time: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  unreadMessage: {
    color: COLORS.text,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

