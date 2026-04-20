import axios from 'axios';
import authService from './authService';
import { LoadingManager } from '../context/LoadingContext';

const BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:5000';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    const token = user?.access_token; 
    
    if (!token) {
        console.warn("No access token found for Store.");
        return {};
    }
    
    return { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const storeService = {
    /**
     * Fetch all available cosmetics and user ownership status
     */
    getStoreItems: async () => {
        LoadingManager.start();
        try {
            const response = await axios.get(`${BASE_URL}/api/store/available`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Store Fetch Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    /**
     * Purchase a new cosmetic item
     */
    purchaseItem: async (cosmeticId) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${BASE_URL}/api/store/purchase`, 
                { cosmetic_id: cosmeticId }, 
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Purchase Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    /**
     * Equip an owned cosmetic item
     */
    equipItem: async (cosmeticId) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${BASE_URL}/api/store/equip`, 
                { cosmetic_id: cosmeticId }, 
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Equip Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    }
};

export default storeService;