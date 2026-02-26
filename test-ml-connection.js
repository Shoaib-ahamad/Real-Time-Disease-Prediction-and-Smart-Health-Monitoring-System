const axios = require('axios');

async function testConnection() {
    try {
        // Test direct ML service
        console.log('Testing ML service directly...');
        const mlHealth = await axios.get('http://localhost:5000/health');
        console.log('✅ ML service:', mlHealth.data);
        
        // Test backend connection
        console.log('\nTesting backend ML route...');
        const backendHealth = await axios.get('http://localhost:3000/api/ml/health');
        console.log('✅ Backend route:', backendHealth.data);
        
        // Test prediction (example)
        console.log('\nTesting prediction...');
        const prediction = await axios.post('http://localhost:3000/api/ml/predict', {
            symptoms: ['fever', 'cough', 'fatigue']
        });
        console.log('✅ Prediction:', prediction.data);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testConnection();