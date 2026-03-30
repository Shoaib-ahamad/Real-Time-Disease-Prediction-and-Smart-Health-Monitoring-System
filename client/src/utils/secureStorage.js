import CryptoJS from 'crypto-js';

// Simple encryption key - in production, use environment variable or derived key
const ENCRYPTION_KEY = 'health-ai-secure-key-2026';

export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), ENCRYPTION_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Secure storage set error:', error);
    }
  },

  getItem: (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Secure storage get error:', error);
      // Clear corrupted data
      localStorage.removeItem(key);
      return null;
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    // Only clear our app's secure keys
    const keys = ['secureCredentials'];
    keys.forEach(key => localStorage.removeItem(key));
  }
};