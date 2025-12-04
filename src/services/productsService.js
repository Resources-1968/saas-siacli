import { API_URL } from '../config/api';

export const productsService = {
    getAllProducts: async (sector = null, region = null) => {
        try {
            const params = new URLSearchParams();
            if (sector) params.append('sector', sector);
            if (region) params.append('region', region);

            const response = await fetch(`${API_URL}/products?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getNicheAnalysis: async () => {
        try {
            const response = await fetch(`${API_URL}/products/niche`);
            if (!response.ok) throw new Error('Failed to fetch niche analysis');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
