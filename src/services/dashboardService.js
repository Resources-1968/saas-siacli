import { API_URL } from '../config/api';

export const dashboardService = {
    getDashboardData: async () => {
        try {
            const response = await fetch(`${API_URL}/dashboard`);
            if (!response.ok) throw new Error('Failed to fetch dashboard data');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
