import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ============= AUTH ENDPOINTS =============
export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);

// ============= ML PREDICTION ENDPOINTS =============
/**
 * Get list of all available symptoms from the ML model
 * @returns {Promise} - Returns list of symptoms
 */
export const getSymptoms = async () => {
  try {
    const response = await API.get('/ml/symptoms');
    return response.data;
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    throw error;
  }
};

/**
 * Make disease prediction based on symptoms
 * @param {Array} symptoms - Array of symptom strings
 * @returns {Promise} - Returns prediction results
 */
export const predictDisease = async (symptoms) => {
  try {
    const response = await API.post('/ml/predict', { symptoms });
    return response.data;
  } catch (error) {
    console.error('Error making prediction:', error);
    throw error;
  }
};

/**
 * Check ML service health status
 * @returns {Promise} - Returns health status
 */
export const checkMLHealth = async () => {
  try {
    const response = await API.get('/ml/health');
    return response.data;
  } catch (error) {
    console.error('ML health check failed:', error);
    return { status: 'disconnected' };
  }
};

// ============= HEALTH RECORDS ENDPOINTS =============
/**
 * Save a health record with prediction results
 * @param {Object} recordData - Health record data
 * @returns {Promise} - Returns saved record
 */
export const saveHealthRecord = (recordData) => API.post('/predictions', recordData);

/**
 * Get user's health history
 * @returns {Promise} - Returns list of health records
 */
export const getHealthHistory = () => API.get('/predictions/history');

/**
 * Get specific health record by ID
 * @param {string} id - Record ID
 * @returns {Promise} - Returns health record
 */
export const getHealthRecord = (id) => API.get(`/predictions/${id}`);

// ============= CHATBOT ENDPOINTS =============
/**
 * Send message to chatbot
 * @param {string} message - User message
 * @returns {Promise} - Returns chatbot response
 */
export const sendChatMessage = (message) => API.post('/chat', { message });

export default API;