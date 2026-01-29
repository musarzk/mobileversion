import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Import screens
import HomeScreen from './index';
import SearchScreen from './search';
import SavedScreen from './saved';
import ProfileScreen from './profile';
import MyListingsScreen from './my-listings';
import AdminScreen from './admin';
import InvestmentsScreen from './investments';
import InvestorPortalScreen from './investor-portal';
import ContactScreen from './contact';
import { COLORS } from '../../constants/theme';

const Tab = createBottomTabNavigator();

// Dummy component for tabs that handle their own navigation via listeners
const PlaceholderComponent = () => null;

// Custom TabIcon component with active border effect
const TabIcon = ({ name, color, focused }: { name: any; color: string; focused: boolean }) => {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: focused ? 3 : 0,
      borderBottomColor: COLORS.primary,
      paddingBottom: 5,
      width: 50,
    }}>
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
};

export default function TabLayout() {
  const { canCreateListing, canAccessAdmin, canViewInvestments } = useRoleAccess();
  const { user } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 70 + (insets.bottom || 10), // Increased height for better spacing
          paddingBottom: insets.bottom || 10,
          paddingTop: 10,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      {/* 1. Browse Properties (Home) */}
      <Tab.Screen
        name="Browse"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />

      {/* Search Tab */}
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="search" color={color} focused={focused} />
          ),
        }}
      />

      {/* 2. Investors Tab */}
      <Tab.Screen
        name="Investors"
        component={InvestorPortalScreen}
        options={{
          tabBarLabel: 'Investors',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="trending-up" color={color} focused={focused} />
          ),
        }}
      />

      {/* 3. Contact Tab */}
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarLabel: 'Contact',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="mail" color={color} focused={focused} />
          ),
        }}
      />

      {/* 4. Sign In (Visible only if NOT logged in) */}
      {!user && (
        <Tab.Screen
          name="SignIn"
          component={PlaceholderComponent}
          options={{
            tabBarLabel: 'Sign In',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="log-in" color={color} focused={focused} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('Login' as never);
            },
          }}
        />
      )}

      {/* 5. List Property */}
      <Tab.Screen
        name="ListProperty"
        component={canCreateListing ? MyListingsScreen : PlaceholderComponent}
        options={{
          tabBarLabel: 'List Property',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="add-circle" color={color} focused={focused} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              navigation.navigate('Login' as never);
            } else if (!canCreateListing) {
              e.preventDefault();
              alert('You need to be an agent to list properties. Please contact support.');
            }
          },
        })}
      />

      {/* Saved - Visible only if logged in */}
      {user && (
        <Tab.Screen
          name="Saved"
          component={SavedScreen}
          options={{
            tabBarLabel: 'Saved',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="heart" color={color} focused={focused} />
            ),
          }}
        />
      )}

      {/* Admin - Visible only if Admin */}
      {canAccessAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            tabBarLabel: 'Admin',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="shield" color={color} focused={focused} />
            ),
          }}
        />
      )}

      {/* Profile - Visible only if logged in */}
      {user && (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="person" color={color} focused={focused} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

