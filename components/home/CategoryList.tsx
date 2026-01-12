import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/theme';

const CATEGORIES = ['All', 'House', 'Villa', 'Apartments', 'Others'];

interface CategoryListProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryList({ selectedCategory, onSelectCategory }: CategoryListProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {CATEGORIES.map((category) => (
                <TouchableOpacity
                    key={category}
                    style={[
                        styles.chip,
                        selectedCategory === category && styles.selectedChip
                    ]}
                    onPress={() => onSelectCategory(category)}
                >
                    <Text style={[
                        styles.text,
                        selectedCategory === category && styles.selectedText
                    ]}>
                        {category}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F7F8FA', // Matching the design's soft background
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedChip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    text: {
        color: '#1A1D1E',
        fontSize: 14,
        fontWeight: '500',
    },
    selectedText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
