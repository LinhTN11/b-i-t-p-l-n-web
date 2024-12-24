import api from './api';
import { store } from '../features/store';
import { reset as resetBudgets } from '../features/budgetSlice';

export const authService = {
    login: async (email, password) => {
        try {
            console.log('Sending login request:', { email }); // Debug log
            const response = await api.post('/user/login', { 
                email, 
                password
            });
            
            console.log('Login response:', response.data); // Debug log
            
            if (response.data.status === 'OK') {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('userId', response.data.data._id);
                localStorage.setItem('user', JSON.stringify(response.data.data));
                
                // Reload page after successful login
                window.location.reload();
                
                return response.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.log('Login error details:', error.response?.data); // Debug log
            throw error;
        }
    },

    register: async (name, email, password, phone) => {
        try {
            console.log('Sending register request:', { email }); // Debug log
            const response = await api.post('/user/register', { 
                name,
                email,
                password,
                phone
            });
            return response.data;
        } catch (error) {
            console.log('Register error details:', error.response?.data); // Debug log
            throw error;
        }
    },

    logout: () => {
        try {
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');

            // Reset Redux budget state
            store.dispatch(resetBudgets());
            
            console.log('Successfully logged out and cleared states');

            // Reload page after logout
            window.location.reload();
        } catch (error) {
            console.error('Error during logout:', error);
            // Still try to reload even if there's an error
            window.location.reload();
        }
    },

    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }
};
