import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Property } from '../types';

interface UsePropertiesOptions {
    limit?: number;
    listingType?: 'sale' | 'rent' | '';
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    location?: string;
}

interface UsePropertiesResult {
    properties: Property[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
    refresh: () => void;
}

export const useProperties = (options: UsePropertiesOptions = {}): UsePropertiesResult => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchProperties = useCallback(async (pageNum: number, reset: boolean = false) => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const params: any = {
                page: pageNum,
                limit: options.limit || 10,
            };

            if (options.listingType) params.listingType = options.listingType;
            if (options.propertyType) params.propertyType = options.propertyType;
            if (options.minPrice) params.minPrice = options.minPrice;
            if (options.maxPrice) params.maxPrice = options.maxPrice;
            if (options.bedrooms) params.bedrooms = options.bedrooms;
            if (options.bathrooms) params.bathrooms = options.bathrooms;
            if (options.location) params.location = options.location;

            const response = await api.get('/properties', { params });

            console.log('📍 Properties API request:', params);
            console.log('✅ Properties response:', response.data);

            if (response.data.success) {
                const newProperties = response.data.properties || [];

                if (reset) {
                    setProperties(newProperties);
                } else {
                    setProperties(prev => [...prev, ...newProperties]);
                }

                setHasMore(newProperties.length === (options.limit || 10));
            } else {
                setError(response.data.message || 'Failed to fetch properties');
            }
        } catch (err: any) {
            console.error('❌ Failed to fetch properties:', err.message);
            console.error('❌ Error response:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to fetch properties');
        } finally {
            setLoading(false);
        }
    }, [options, loading]);

    useEffect(() => {
        setPage(1);
        setProperties([]);
        setHasMore(true);
        fetchProperties(1, true);
    }, [
        options.listingType,
        options.propertyType,
        options.minPrice,
        options.maxPrice,
        options.bedrooms,
        options.bathrooms,
        options.location,
    ]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProperties(nextPage, false);
        }
    }, [page, loading, hasMore, fetchProperties]);

    const refresh = useCallback(() => {
        setPage(1);
        setProperties([]);
        setHasMore(true);
        fetchProperties(1, true);
    }, [fetchProperties]);

    return {
        properties,
        loading,
        error,
        hasMore,
        loadMore,
        refresh,
    };
};
