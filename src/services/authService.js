import axios from 'axios';
import { LoadingManager } from '../context/LoadingContext';

const BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:5000';

/**
 * GLOBAL AXIOS CONFIGURATION
 */
axios.defaults.timeout = 10000; // 10 seconds timeout

const authService = {
    // --- BLOCKING OPERATIONS (Show Global Loading) ---

    register: async (userData) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${BASE_URL}/auth/register`, userData);
            return response.data;
        } catch (error) {
            console.error("Registration Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    login: async (username, password) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, 
                { username, password }, 
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            if (response.data.access_token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error("Login Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    updateProfile: async (updateData) => {
        LoadingManager.start();
        const currentUser = authService.getCurrentUser();
        try {
            const response = await axios.put(`${BASE_URL}/auth/update`, updateData, {
                headers: { 
                    'Authorization': `Bearer ${currentUser?.access_token}`,
                    'Content-Type': 'application/json' 
                }
            });
            return response.data;
        } catch (error) {
            console.error("Profile Update Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    // --- SILENT BACKGROUND OPERATIONS (No Global Loading) ---

    getLeaderboard: async () => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.access_token) return [];

        try {
            const response = await axios.get(`${BASE_URL}/auth/leaderboard`, {
                headers: { 
                    'Authorization': `Bearer ${currentUser.access_token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Leaderboard Fetch Error:", error.response?.data);
            throw error;
        }
    },

    getWealthLeaderboard: async () => {
        const user = authService.getCurrentUser();
        try {
            const response = await axios.get(`${BASE_URL}/auth/leaderboard/wealth`, {
                headers: { Authorization: `Bearer ${user.access_token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Wealth Fetch Error:", error.response?.data);
            throw error;
        }
    },

    getUserProfile: async () => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser?.access_token) return null;

        try {
            const response = await axios.get(`${BASE_URL}/auth/user`, {
                headers: { 
                    'Authorization': `Bearer ${currentUser.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.user) {
                // Sync local storage with fresh DB data (XP, Coins, etc.)
                const updatedUser = { ...currentUser, user: response.data.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            
            return response.data;
        } catch (error) {
            console.error("Profile Fetch Error:", error.response?.data);
            throw error;
        }
    },

    // --- SESSION MANAGEMENT ---

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            return null;
        }
    }
};

export default authService;