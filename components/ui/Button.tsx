import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  variant = 'primary',
  loading = false,
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return '#9CA3AF'; // Gray for disabled
    switch (variant) {
      case 'primary': return COLORS.primary;
      case 'secondary': return COLORS.secondary;
      case 'outline': return 'transparent';
      case 'danger': return COLORS.error;
      default: return COLORS.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return COLORS.primaryForeground;
      case 'secondary': return COLORS.secondaryForeground;
      case 'outline': return COLORS.primary;
      case 'danger': return '#FFFFFF';
      default: return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return COLORS.primary;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
