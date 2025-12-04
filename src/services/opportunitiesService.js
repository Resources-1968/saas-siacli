import { API_URL } from '../config/api';

export const opportunitiesService = {
    getOpportunities: async () => {
        try {
            const response = await fetch(`${API_URL}/opportunities`);
            if (!response.ok) throw new Error('Failed to fetch opportunities');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getStrategyByRegion: async (regionName) => {
        try {
            const response = await fetch(`${API_URL}/opportunities/strategy/${encodeURIComponent(regionName)}`);
            if (!response.ok) throw new Error('Failed to fetch strategy');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
