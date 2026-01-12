import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/(auth)/login';
import RegisterScreen from './app/(auth)/register';
import TabLayout from './app/(tabs)/_layout';
import PropertyDetailsScreen from './app/property/[id]';
import CreateListingScreen from './app/listing/create';
import ManageUsersScreen from './app/admin/users';
import ManagePropertiesScreen from './app/admin/properties';
import InvestScreen from './app/investor/invest/[id]';
import InvestmentPlanScreen from './app/investor/investment-plan';
import CreatePortfolioScreen from './app/investor/create-portfolio';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { COLORS } from './constants/theme';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Public Stack - accessible without authentication
          <>
            <Stack.Screen name="MainTabs" component={TabLayout} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Authenticated Stack - full access
          <>
            <Stack.Screen name="MainTabs" component={TabLayout} />
            <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
            <Stack.Screen name="CreateListing" component={CreateListingScreen} />
            <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
            <Stack.Screen name="ManageProperties" component={ManagePropertiesScreen} />
            <Stack.Screen name="Invest" component={InvestScreen} />
            <Stack.Screen name="InvestmentPlan" component={InvestmentPlanScreen} />
            <Stack.Screen name="CreatePortfolio" component={CreatePortfolioScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
  },
});


export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
