import React, { useRef } from "react";
import { View, TouchableOpacity, TextInput, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";

interface Props {
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  onClearSearch?: () => void;
  onFilterPress: () => void;
  activeFilterCount?: number;
  showHomeButton?: boolean;
}

const SearchHeader = ({
  onFilterPress,
  activeFilterCount = 0,
  searchQuery = "",
  onSearchChange,
  onClearSearch,
  showHomeButton = false
}: Props) => {
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null);

  const handleClear = () => {
    if (onClearSearch) {
      onClearSearch();
    }
    inputRef.current?.focus();
  };

  const handleGoHome = () => {
    // @ts-ignore
    navigation.navigate('Browse');
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.searchContainer}>
        {showHomeButton && (
          <TouchableOpacity
            onPress={handleGoHome}
            style={styles.iconButton}
            activeOpacity={0.6}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => inputRef.current?.focus()}
          style={styles.iconButton}
          activeOpacity={0.6}
        >
          <Ionicons name="search" size={20} color="#666876" />
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search properties..."
          style={styles.input}
          placeholderTextColor="#666876"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            style={styles.iconButton}
            activeOpacity={0.6}
          >
            <Ionicons name="close-circle" size={25} color="#666876" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      <TouchableOpacity
        onPress={onFilterPress}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        style={styles.filterButton}
        activeOpacity={0.6}
      >
        <Ionicons name="options" size={22} color={COLORS.primary} />

        {activeFilterCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {activeFilterCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  iconButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#111827',
    paddingHorizontal: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  filterButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 200,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    lineHeight: 11,
  },
});

export default SearchHeader;