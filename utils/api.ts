import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 1. Instantiate the base client configuration
const api = axios.create({
    baseURL: 'https://api.housexpertz.in',
    timeout: 10000, // 10 second timeout threshold
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// 2. Request Interceptor: Inject token automatically on every outgoing network call
api.interceptors.request.use(
    async (config: any) => {
        try {
            const token = await SecureStore.getItemAsync('user_session_token');
            if (token && config.headers) {
                // Attaches the secure token dynamically to your backend's allowedHeaders
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('[API SecureStore Error]: Could not read local auth key.', error);
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor: Catch global server issues (like unauthorized 401 kicks)
api.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
        if (error.response && error.response.status === 401) {
            console.warn('[API Auth Exception]: Session expired or invalid token detected.');
            // Handle automatic logout routines or redirect protocols here if needed
            await SecureStore.deleteItemAsync('user_session_token');
        }
        return Promise.reject(error);
    }
);

export default api;