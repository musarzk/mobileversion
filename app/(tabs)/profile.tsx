import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import UserInfoCard from '../../components/profile/UserInfoCard';
import MenuItem from '../../components/ui/MenuItem';
import Button from '../../components/ui/Button';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const menuItems = [
    { icon: 'chatbubbles-outline', label: 'Messages', route: '/messages' },
    { icon: 'briefcase-outline', label: 'Create Portfolio', route: '/investor/create-portfolio' },
    { icon: 'pie-chart-outline', label: 'Investment Plan', route: '/investor/investment-plan' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <View style={styles.content}>
        {/* User Info Card */}
        <UserInfoCard 
          name={user?.name || ''} 
          email={user?.email || ''} 
          role={user?.role || ''} 
        />

        {/* Investor Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investor Tools</Text>
          {menuItems.map((item, index) => (
            <MenuItem 
              key={index}
              icon={item.icon as any} 
              label={item.label} 
              onPress={() => router.push(item.route as any)} 
            />
          ))}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <MenuItem 
            icon="person-outline" 
            label="Edit Profile" 
            onPress={() => {}} 
          />
          
          <MenuItem 
            icon="lock-closed-outline" 
            label="Change Password" 
            onPress={() => {}} 
          />
          
          <MenuItem 
            icon="notifications-outline" 
            label="Notifications" 
            onPress={() => {}} 
          />
        </View>

        {/* Logout Button */}
        <Button 
          title="Logout" 
          onPress={logout} 
          variant="danger"
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 24,
  },

});

