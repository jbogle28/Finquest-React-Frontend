import axios from 'axios';
import { LoadingManager } from '../context/LoadingContext';

const BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:5000';
const API_URL = `${BASE_URL}/finance`;
/**
 * GLOBAL AXIOS CONFIGURATION
 */
axios.defaults.timeout = 10000;

// Helper to get JWT token from storage
const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.access_token) {
        return { Authorization: `Bearer ${user.access_token}` };
    }
    return {};
};

/**
 * Global Interceptor for handling 401s (Unauthorized/Expired Token)
 */
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Session expired or unauthorized.");
            // Optional: localStorage.removeItem('user'); window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const financeService = {
    // --- BOND MARKET ---
    getBondMarket: async () => {
        const response = await axios.get(`${API_URL}/bonds/market`, { headers: getAuthHeader() });
        return response.data;
    },

    purchaseBond: async (bondId, quantity = 1) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${API_URL}/bonds/purchase`,
                { bond_id: bondId, quantity },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Bond Purchase Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    // --- STOCK MARKET ---
    getStockMarket: async () => {
        const response = await axios.get(`${API_URL}/stocks/market`, { headers: getAuthHeader() });
        return response.data;
    },

    tradeStock: async (stockId, action, quantity) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${API_URL}/stocks/trade`,
                { stock_id: stockId, action, quantity },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Stock Trade Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    tickStocks: async () => {
        // Typically a background or triggered simulation, usually kept silent
        const response = await axios.post(`${API_URL}/stocks/tick`, {}, { headers: getAuthHeader() });
        return response.data;
    },

    // --- FIXED DEPOSITS (FD) ---
    getFDMarket: async () => {
        const response = await axios.get(`${API_URL}/fd/market`, { 
            headers: getAuthHeader() 
        });
        return response.data;
    },

    getFDStatus: async () => {
        const response = await axios.get(`${API_URL}/fd/status`, { headers: getAuthHeader() });
        return response.data;
    },

    createFD: async (amount, marketId) => {
        LoadingManager.start();
        try {
            const cleanAmount = parseFloat(amount);
            const response = await axios.post(`${API_URL}/fd/create`, 
                { 
                    amount: cleanAmount, 
                    market_id: parseInt(marketId) 
                }, 
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("FD Creation Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    withdrawFD: async (fdId) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${API_URL}/fd/withdraw`, 
                { fd_id: fdId }, 
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("FD Withdrawal Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    // --- PORTFOLIO ---
    getPortfolioDetails: async () => {
        const response = await axios.get(`${API_URL}/portfolio/details`, { headers: getAuthHeader() });
        return response.data;
    },

    getPortfolioSummary: async () => {
        const response = await axios.get(`${API_URL}/portfolio/details`, { headers: getAuthHeader() });
        return response.data;
    }
};

export default financeService;
