import axios from 'axios';
import authService from './authService';
import { LoadingManager } from '../context/LoadingContext';

const API_URL = ${process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://localhost:5000'}/game;
/**
 * GLOBAL AXIOS CONFIGURATION
 */
axios.defaults.timeout = 10000;

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    const token = user?.access_token; 
    
    if (!token) {
        console.warn("No access token found. User may need to log in.");
        return {};
    }
    
    return { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const gameService = {
    /**
     * CROSSWORD ENDPOINTS
     */
    getCrossword: async (topic) => {
        // Silent fetch to allow component-level loading UI
        const response = await axios.get(`${API_URL}/crossword/${topic}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    submitCrossword: async (payload) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${API_URL}/crossword/submit`, payload, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Crossword Submission Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    /**
     * HANGMAN ENDPOINTS
     */
    startHangman: async () => {
        // Silent fetch
        const response = await axios.get(`${API_URL}/hangman/start`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    guessLetter: async (termId, guess) => {
        // Guesses are usually fast/silent to avoid disrupting gameplay flow
        const response = await axios.post(`${API_URL}/hangman/guess`, 
            { term_id: termId, guess: guess }, 
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    submitHangmanResult: async (winStatus, termId) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${API_URL}/hangman/result`, 
                { win: winStatus, term_id: termId }, 
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Hangman Result Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    /**
     * TIME CHALLENGE ENDPOINTS
     */
    getTimeChallengePairs: async (count) => {
        // Silent fetch
        const response = await axios.get(`${API_URL}/time-challenge/start`, {
            params: { count }, 
            headers: getAuthHeader()
        });
        return response.data;
    },

    submitTimeChallengeResult: async (payload) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${API_URL}/time-challenge/submit`, payload, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Time Challenge Result Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    /**
     * ECONOMY / UTILITY
     */
    deductCoins: async (amount, activity) => {
        LoadingManager.start();
        try {
            const response = await axios.post(`${API_URL}/deduct-coins`, 
                { amount, activity }, 
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Coin Deduction Error:", error.response?.data);
            throw error;
        } finally {
            LoadingManager.stop();
        }
    },

    

};



export default gameService;
