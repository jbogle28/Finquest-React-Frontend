import axios from 'axios';
import authService from './authService';
import { LoadingManager } from '../context/LoadingContext';

const BASE_URL = 'http://127.0.0.1:5000';

const getHeaders = () => {
    const user = authService.getCurrentUser();
    return {
        'Authorization': `Bearer ${user?.access_token}`,
        'Content-Type': 'application/json'
    };
};

const profileService = {
    // Fetches items the user already bought
    getOwnedAvatars: async () => {
        LoadingManager.start();
        try {
            const response = await axios.get(`${BASE_URL}/api/store/my-inventory`, { headers: getHeaders() });
            
            // Your backend returns { "count": X, "inventory": [...] }
            const inventoryData = response.data.inventory || [];

            return {
                ...response.data,
                inventory: inventoryData.map(item => ({
                    cosmetic_id: item.cosmetic_id,
                    name: item.name,
                    image_url: item.image_url,
                    is_active: item.is_active // Added to help the UI find the active one
                }))
            };
        } finally {
            LoadingManager.stop();
        }
    },

    equipAvatar: async (cosmeticId) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${BASE_URL}/api/store/equip`, { cosmetic_id: cosmeticId }, { headers: getHeaders() });
            return response.data;
        } finally {
            LoadingManager.stop();
        }
    },

    updateInfo: async (formData) => {
        LoadingManager.start();
        try {
            // FIX: Removed the extra "/api" or "/auth" prefix that caused the 404
            const response = await axios.put(`${BASE_URL}/auth/update`, formData, { headers: getHeaders() });
            return response.data;
        } finally {
            LoadingManager.stop();
        }
    }
};

export default profileService;