const axios = require('axios');

const ML_URL = 'http://localhost:5000';
const BACKEND_URL = 'http://localhost:3000';

async function testMLConnection() {
    console.log('🔍 Testing ML Service Connection...\n');
    
    // Test 1: Direct ML prediction
    try {
        console.log('1. Testing direct ML prediction...');
        const symptoms = ['fever', 'cough', 'fatigue'];
        
        const mlResponse = await axios.post(`${ML_URL}/predict`, {
            symptoms: symptoms
        });
        
        console.log('✅ ML Service responded!');
        console.log('   Predictions:', mlResponse.data);
        console.log();
    } catch (error) {
        console.error('❌ ML Service error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
    
    // Test 2: Backend prediction route
    try {
        console.log('2. Testing backend prediction route...');
        const symptoms = ['fever', 'cough', 'fatigue'];
        
        const backendResponse = await axios.post(`${BACKEND_URL}/api/ml/predict`, {
            symptoms: symptoms
        });
        
        console.log('✅ Backend route responded!');
        console.log('   Response:', backendResponse.data);
        console.log();
    } catch (error) {
        console.error('❌ Backend error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
    
    // Test 3: Get symptoms list
    try {
        console.log('3. Testing symptoms list endpoint...');
        
        const symptomsResponse = await axios.get(`${BACKEND_URL}/api/ml/symptoms`);
        
        console.log('✅ Got symptoms list!');
        console.log(`   Total symptoms: ${symptomsResponse.data.symptoms.length}`);
        console.log('   First 5 symptoms:', symptomsResponse.data.symptoms.slice(0, 5));
        console.log();
    } catch (error) {
        console.error('❌ Symptoms endpoint error:', error.message);
    }
    
    // Test 4: Health check
    try {
        console.log('4. Testing health check...');
        
        const healthResponse = await axios.get(`${BACKEND_URL}/api/ml/health`);
        
        console.log('✅ Health check:', healthResponse.data);
    } catch (error) {
        console.error('❌ Health check error:', error.message);
    }
}

testMLConnection();