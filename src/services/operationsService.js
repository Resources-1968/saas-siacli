import { API_URL } from '../config/api';

export const operationsService = {
    getTasks: async () => {
        try {
            const response = await fetch(`${API_URL}/operations/tasks`);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateTaskStatus: async (taskId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/operations/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) throw new Error('Failed to update task');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    createTask: async (task) => {
        try {
            const response = await fetch(`${API_URL}/operations/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(task)
            });
            if (!response.ok) throw new Error('Failed to create task');
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
