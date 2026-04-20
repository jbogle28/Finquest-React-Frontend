import axios from 'axios';
import authService from './authService';
import { LoadingManager } from '../context/LoadingContext';

const BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:5000';

/**
 * GLOBAL AXIOS CONFIGURATION
 */
axios.defaults.timeout = 10000;

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user && user.access_token) {
        return { Authorization: `Bearer ${user.access_token}` };
    }
    return {};
};
const quizService = {
    /**
     * Requirement: Fetch random questions based on topic and difficulty
     * (Silent fetch for component-level loading)
     */
    getQuestions: async (topic, difficulty = 1) => {
        const user = authService.getCurrentUser();
        try {
            const response = await axios.get(`${BASE_URL}/quiz/start`, {
                params: { topic, difficulty },
                headers: { Authorization: `Bearer ${user?.access_token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching questions:", error.response?.data);
            throw error;
        }
    },

    /**
     * Requirement: Submit quiz results, rewards, and the snapshot for persistence
     * (Blocking operation to ensure data integrity)
     */
    submitQuiz: async (quizData) => {
        LoadingManager.start();
        const user = authService.getCurrentUser();
        try {
            const response = await axios.post(`${BASE_URL}/quiz/submit`, quizData, {
                headers: { 
                    Authorization: `Bearer ${user?.access_token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error submitting quiz:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    /**
     * Fetch user's previous quiz attempts
     */
    getUserHistory: async () => {
        const user = authService.getCurrentUser();
        try {
            const response = await axios.get(`${BASE_URL}/quiz/history`, {
                headers: { Authorization: `Bearer ${user?.access_token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching history:", error.response?.data);
            throw error;
        }
    },

    /**
     * Fetch the snapshot from a previous session for the Review screen
     */
    getReview: async (historyId) => {
        const user = authService.getCurrentUser();
        try {
            const response = await axios.get(`${BASE_URL}/quiz/review/${historyId}`, {
                headers: { Authorization: `Bearer ${user?.access_token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching review:", error.response?.data);
            throw error;
        }
    },

     /**
     * SCENARIO / SIMULATION ENDPOINTS
     */
    getScenario: async (id) => {
        const response = await axios.get(`${BASE_URL}/quiz/scenario/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    submitScenarioResult: async (payload) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${BASE_URL}/quiz/scenario/submit`, payload, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Scenario Submission Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },   
};

export default quizService;