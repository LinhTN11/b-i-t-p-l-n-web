import api from './api';
import { store } from '../features/store';
import { reset as resetBudgets } from '../features/budgetSlice';
import { clearUserData } from '../features/userSlice';

export const authService = {
    login: async (email, password) => {
        try {
            console.log('Sending login request:', { email });
            const response = await api.post('/user/login', { 
                email, 
                password
            });
            
            if (response.data.status === 'OK') {
                const userData = response.data.data;

                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('userId', userData._id);
                localStorage.setItem('user', JSON.stringify(userData));
                
                window.location.reload();
                return response.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response?.data);
            throw error;
        }
    },

    register: async (name, email, password, phone) => {
        try {
            const response = await api.post('/user/register', { 
                name,
                email,
                password,
                confirmPassword: password,
                phone
            });
            return response.data;
        } catch (error) {
            console.error('Register error details:', error.response?.data);
            throw error;
        }
    },

    logout: () => {
        try {
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');

            // Reset Redux states
            store.dispatch(resetBudgets());
            store.dispatch(clearUserData());
            
            // Reload page after logout
            window.location.reload();
        } catch (error) {
            console.error('Error during logout:', error);
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
