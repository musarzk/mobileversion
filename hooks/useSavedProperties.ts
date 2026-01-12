import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Property } from '../types';

export const useSavedProperties = () => {
    const [savedProperties, setSavedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSavedProperties = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/users/favorites');
            if (response.data.success) {
                setSavedProperties(response.data.properties || []);
            } else {
                setError(response.data.message || 'Failed to fetch saved properties');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch saved properties');
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleFavorite = async (propertyId: string) => {
        try {
            const response = await api.post('/users/favorites', { propertyId });
            if (response.data.success) {
                // Refresh list if we are on the saved screen
                fetchSavedProperties();
                return response.data.isFavorited;
            }
        } catch (err: any) {
            console.error('Failed to toggle favorite:', err);
        }
        return null;
    };

    useEffect(() => {
        fetchSavedProperties();
    }, [fetchSavedProperties]);

    return {
        savedProperties,
        loading,
        error,
        refresh: fetchSavedProperties,
        toggleFavorite,
    };
};
