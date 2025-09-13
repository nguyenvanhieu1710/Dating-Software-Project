import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const httpClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor cho request (ví dụ: tự động thêm token)
httpClient.interceptors.request.use(
    async (config) => {
        // Ví dụ: Lấy token từ AsyncStorage hoặc context
        // const token = await AsyncStorage.getItem('accessToken');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
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
