import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';

export default function CreatePortfolioScreen() {
  const navigation = useNavigation();
  const [budget, setBudget] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('Moderate');
  const [propertyType, setPropertyType] = useState('Residential');

  const handleCreate = () => {
    Alert.alert('Success', 'Portfolio created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Portfolio</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Tell us about your investment goals and we'll help you build a diversified real estate portfolio.
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Investment Budget</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. $50,000"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Risk Tolerance</Text>
          <View style={styles.optionsContainer}>
            {['Low', 'Moderate', 'High'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionChip,
                  riskTolerance === option && styles.selectedOption
                ]}
                onPress={() => setRiskTolerance(option)}
              >
                <Text style={[
                  styles.optionText,
                  riskTolerance === option && styles.selectedOptionText
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Preferred Property Type</Text>
          <View style={styles.optionsContainer}>
            {['Residential', 'Commercial', 'Industrial'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionChip,
                  propertyType === option && styles.selectedOption
                ]}
                onPress={() => setPropertyType(option)}
              >
                <Text style={[
                  styles.optionText,
                  propertyType === option && styles.selectedOptionText
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Create Portfolio</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 24,
    lineHeight: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

