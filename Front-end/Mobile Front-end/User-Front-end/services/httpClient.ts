import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const httpClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to automatically add auth token
httpClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor cho response (xử lý lỗi tập trung)
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Có thể xử lý lỗi chung ở đây (ví dụ: thông báo toast, log, refresh token...)
        return Promise.reject(error);
    }
);

export default httpClient;
