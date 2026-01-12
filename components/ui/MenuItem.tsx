import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  style?: StyleProp<ViewStyle>;
  iconColor?: string;
}

export default function MenuItem({
  icon,
  label,
  onPress,
  showChevron = true,
  style,
  iconColor = COLORS.textMuted,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
    >
      <View style={styles.leftContent}>
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text style={styles.label}>{label}</Text>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
  },
});
