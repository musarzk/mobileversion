/**
 * Formats a number into a readable currency string with M/B suffixes
 * @param price The numerical price value
 * @returns Formatted string (e.g., 5M, 2B, 500,000)
 */
export const formatPrice = (price: number): string => {
    if (!price && price !== 0) return '0';
    
    if (price >= 1000000000) {
        const value = price / 1000000000;
        return `${Number.isInteger(value) ? value : value.toFixed(1)}B`;
    }
    
    if (price >= 1000000) {
        const value = price / 1000000;
        return `${Number.isInteger(value) ? value : value.toFixed(1)}M`;
    }
    
    return price.toLocaleString();
};
