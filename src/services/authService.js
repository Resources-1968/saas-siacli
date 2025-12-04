import { API_URL } from '../config/api';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error de autenticación');
            }

            const data = await response.json();
            return {
                user: {
                    ...data,
                    avatar: 'https://ui-avatars.com/api/?name=' + data.name
                },
                token: 'mock_jwt_token_' + Date.now() // Backend doesn't send token yet, simulating it
            };
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        return true;
    },

    getCurrentUser: async () => {
        return null;
    }
};
