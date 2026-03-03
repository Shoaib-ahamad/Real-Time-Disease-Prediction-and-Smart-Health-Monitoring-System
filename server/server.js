const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();
console.log('📋 Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MongoDB URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Not set');
console.log('CLIENT_URL:', process.env.CLIENT_URL);

// Create Express app
const app = express();

// Basic middleware - apply BEFORE routes
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
console.log('✅ CORS configured');

// Simple test route (no DB needed)
app.get('/', (req, res) => {
    res.json({ message: 'API is running!' });
});

// Health check route (no DB needed)
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'API is healthy' });
});

// Connect to MongoDB
console.log('🔄 Testing MongoDB connection...');
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        
        // Import routes AFTER successful DB connection
        const authRoutes = require('./routes/authRoutes');
        const predictRoutes = require('./routes/predictionRoutes'); // Import predict routes
        const mlRoutes = require('./routes/mlRoutes');
        
        // Use routes - ORDER MATTERS: more specific routes first
        app.use('/api/auth', authRoutes);
        app.use('/api/predict', predictRoutes); // NOW this will work
        app.use('/api/ml', mlRoutes);
        
        console.log('✅ Routes registered:');
        console.log('   - /api/auth/*');
        console.log('   - /api/predict/*'); // Should now appear
        console.log('   - /api/ml/*');
        
        // 404 handler - must be AFTER all routes
        app.use((req, res) => {
            res.status(404).json({ 
                success: false, 
                error: `Route ${req.originalUrl} not found` 
            });
        });
        
        // Start server after everything is set up
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`\n✅ Server running on port ${PORT}`);
            console.log('\n📝 Available endpoints:');
            console.log('   GET  /');
            console.log('   GET  /api/health');
            console.log('   POST /api/auth/register');
            console.log('   POST /api/auth/login');
            console.log('   GET  /api/auth/profile');
            console.log('   POST /api/predict/symptoms'); // Should now work
            console.log('   GET  /api/predict/history');
            console.log('   GET  /api/predict/:id');
            console.log('   DELETE /api/predict/:id');
            console.log('   GET  /api/ml/health');
            console.log('   GET  /api/ml/symptoms');
            console.log('   POST /api/ml/predict');
        });
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });