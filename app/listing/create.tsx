import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import { COLORS } from '../../constants/theme';

export default function CreateListingScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        sqft: '',
        yearBuilt: '',
        propertyType: 'house',
        listingType: 'sale',
    });

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImages([...images, ...result.assets]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.title || !formData.price || !formData.location) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            
            // Add basic info
            Object.keys(formData).forEach(key => {
                data.append(key, (formData as any)[key]);
            });

            // Parse numbers correctly for backend
            data.append('price', parseInt(formData.price).toString());
            data.append('bedrooms', (parseInt(formData.bedrooms) || 0).toString());
            data.append('bathrooms', (parseInt(formData.bathrooms) || 0).toString());
            data.append('sqft', (parseInt(formData.sqft) || 0).toString());
            if (formData.yearBuilt) {
                data.append('yearBuilt', parseInt(formData.yearBuilt).toString());
            }

            // Add images
            images.forEach((image, index) => {
                const uriParts = image.uri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                
                // @ts-ignore - FormData issue in React Native
                data.append('images', {
                    uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
                    name: `photo_${index}.${fileType}`,
                    type: `image/${fileType}`,
                });
            });

            const response = await api.post('/properties', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                Alert.alert('Success', 'Property listing created successfully', [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]);
            } else {
                Alert.alert('Error', response.data.message || 'Failed to create listing');
            }
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Listing</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Image Picker */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Property Images</Text>
                    <View style={styles.imageGrid}>
                        {images.map((image, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.removeImageBtn}
                                    onPress={() => removeImage(index)}
                                >
                                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.addImageBox} onPress={handlePickImage}>
                            <Ionicons name="add" size={32} color="#9CA3AF" />
                            <Text style={styles.addText}>Add Photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Basic Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Title <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Modern Downtown Apartment"
                            value={formData.title}
                            onChangeText={(text) => setFormData({ ...formData, title: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe the property..."
                            multiline={true}
                            numberOfLines={4}
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Price <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., 450000"
                            keyboardType="numeric"
                            value={formData.price}
                            onChangeText={(text) => setFormData({ ...formData, price: text })}
                        />
                    </View>
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Location</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            City/Location <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., New York"
                            value={formData.location}
                            onChangeText={(text) => setFormData({ ...formData, location: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., 123 Main St, New York, NY 10001"
                            value={formData.address}
                            onChangeText={(text) => setFormData({ ...formData, address: text })}
                        />
                    </View>
                </View>

                {/* Property Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Property Details</Text>

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Bedrooms</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={formData.bedrooms}
                                onChangeText={(text) => setFormData({ ...formData, bedrooms: text })}
                            />
                        </View>

                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Bathrooms</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={formData.bathrooms}
                                onChangeText={(text) => setFormData({ ...formData, bathrooms: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Square Feet</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={formData.sqft}
                                onChangeText={(text) => setFormData({ ...formData, sqft: text })}
                            />
                        </View>

                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Year Built</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., 2020"
                                keyboardType="numeric"
                                value={formData.yearBuilt}
                                onChangeText={(text) => setFormData({ ...formData, yearBuilt: text })}
                            />
                        </View>
                    </View>

                    {/* Property Type */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Property Type</Text>
                        <View style={styles.buttonGroup}>
                            {['house', 'apartment', 'condo', 'townhouse'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[
                                        styles.typeButton,
                                        formData.propertyType === type ? styles.typeButtonActive : {},
                                    ]}
                                    onPress={() => setFormData({ ...formData, propertyType: type })}
                                >
                                    <Text
                                        style={[
                                            styles.typeButtonText,
                                            formData.propertyType === type ? styles.typeButtonTextActive : {},
                                        ]}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Listing Type */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Listing Type</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    formData.listingType === 'sale' ? styles.typeButtonActive : {},
                                ]}
                                onPress={() => setFormData({ ...formData, listingType: 'sale' })}
                            >
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        formData.listingType === 'sale' ? styles.typeButtonTextActive : {},
                                    ]}
                                >
                                    For Sale
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    formData.listingType === 'rent' ? styles.typeButtonActive : {},
                                ]}
                                onPress={() => setFormData({ ...formData, listingType: 'rent' })}
                            >
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        formData.listingType === 'rent' ? styles.typeButtonTextActive : {},
                                    ]}
                                >
                                    For Rent
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.submitButton, loading ? styles.submitButtonDisabled : {}]}
                    onPress={handleSubmit}
                    disabled={Boolean(loading)}
                >
                    {loading ? (
                        <ActivityIndicator animating={true} color="#FFFFFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Create Listing</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    required: {
        color: '#EF4444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#111827',
        backgroundColor: '#FFFFFF',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    halfInput: {
        flex: 1,
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
    },
    typeButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeButtonText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    typeButtonTextActive: {
        color: '#FFFFFF',
    },
    footer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#60A5FA',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 8,
    },
    imageWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeImageBtn: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },
    addImageBox: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    addText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
});


