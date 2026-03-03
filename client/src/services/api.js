import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🚀 Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.status, error.config?.url);
        return Promise.reject(error);
    }
);

// ============ ML SERVICE API (for symptoms list) ============
export const checkMLHealth = async () => {
    const response = await api.get('/ml/health');
    return response.data;
};

export const getSymptoms = async () => {
    const response = await api.get('/ml/symptoms');
    return response.data;
};

// ============ PREDICTION API (for making predictions) ============
export const predictDisease = async (symptoms, userData = {}) => {
    // This calls the CORRECT endpoint: /api/predict/symptoms
    const response = await api.post('/predict/symptoms', {
        symptoms,
        age: userData.age,
        temperature: userData.temperature,
        bp: userData.bp
    });
    return response.data;
};

// ============ HISTORY API ============
export const getHistory = async () => {
    const response = await api.get('/predict/history');
    return response.data;
};

export const getPredictionRecord = async (id) => {
    const response = await api.get(`/predict/${id}`);
    return response.data;
};

export const deletePredictionRecord = async (id) => {
    const response = await api.delete(`/predict/${id}`);
    return response.data;
};

// ============ AUTH API ============
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};

export default api;