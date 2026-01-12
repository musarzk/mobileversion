import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

interface HomeHeaderProps {
  greeting?: string;
}

export default function HomeHeader({ greeting = 'Welcome back' }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingLabel}>{greeting}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  greetingLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
