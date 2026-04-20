import React, { createContext, useContext, useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';

// This MUST be exported so authService.js can access it
export const LoadingManager = {
    _count: 0,
    _listener: null,
    start() {
        this._count++;
        if (this._listener) this._listener(true);
    },
    stop() {
        this._count = Math.max(0, this._count - 1);
        if (this._count === 0 && this._listener) this._listener(false);
    },
    subscribe(listener) {
        this._listener = listener;
    }
};

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Subscribe the React state setter to the vanilla JS manager
        LoadingManager.subscribe(setLoading);
    }, []);

    return (
        <LoadingContext.Provider value={{}}>
            {loading && <LoadingScreen />}
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);