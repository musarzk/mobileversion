import React from 'react';
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
          height: 60 + (insets.bottom || 10),
          paddingBottom: insets.bottom || 10,
          paddingTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      {/* 1. Browse Properties (Home) */}
      <Tab.Screen
        name="Browse"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={Number(size)} color={color} />
          ),
        }}
      />

      {/* 2. Investors Tab */}
      <Tab.Screen
        name="Investors"
        component={InvestorPortalScreen}
        options={{
          tabBarLabel: 'Investors',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={Number(size)} color={color} />
          ),
        }}
      />

      {/* 3. Contact Tab */}
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarLabel: 'Contact',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail" size={Number(size)} color={color} />
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
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="log-in" size={Number(size)} color={color} />
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={Number(size)} color={color} />
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

      {/* Hidden Tabs (accessible via other means or conditional) */}



      {/* Saved - Visible only if logged in */}
      {user && (
        <Tab.Screen
          name="Saved"
          component={SavedScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={Number(size)} color={color} />
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
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="shield" size={Number(size)} color={color} />
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
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={Number(size)} color={color} />
            ),
          }}
        />
      )}

      {/* Search Screen - removed to fix ghost space in tab bar */}
    </Tab.Navigator>
  );
}

