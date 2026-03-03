const axios = require('axios');
require('dotenv').config();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

async function testMLConnection() {
    console.log('🔍 Testing ML Service Connection...');
    console.log('ML Service URL:', ML_SERVICE_URL);
    
    try {
        // Test 1: Health check
        console.log('\n1️⃣ Testing health endpoint...');
        const health = await axios.get(`${ML_SERVICE_URL}/health`);
        console.log('✅ Health check passed:', health.data);
        
        // Test 2: Get symptoms list
        console.log('\n2️⃣ Testing symptoms endpoint...');
        const symptoms = await axios.get(`${ML_SERVICE_URL}/symptoms`);
        console.log('✅ Got symptoms list:', symptoms.data.count, 'symptoms');
        console.log('First 5 symptoms:', symptoms.data.symptoms.slice(0, 5));
        
        // Test 3: Make a prediction
        console.log('\n3️⃣ Testing prediction endpoint...');
        const testSymptoms = ['itching', 'skin_rash', 'fatigue'];
        const prediction = await axios.post(`${ML_SERVICE_URL}/predict`, {
            symptoms: testSymptoms
        });
        console.log('✅ Prediction successful:');
        console.log('Input symptoms:', testSymptoms);
        console.log('Predictions:', prediction.data);
        
        console.log('\n🎉 All tests passed! ML service is working correctly!');
        
    } catch (error) {
        console.error('\n❌ Test failed:');
        if (error.code === 'ECONNREFUSED') {
            console.error('ML service is not running on', ML_SERVICE_URL);
            console.error('Make sure to run: python app.py in the ml-model/symptons directory');
        } else if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testMLConnection();