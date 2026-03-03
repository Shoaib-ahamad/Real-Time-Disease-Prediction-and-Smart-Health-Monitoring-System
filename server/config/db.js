/* const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("⏳ Attempting to connect to MongoDB...");
    
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
    
    // Log URI partially for debugging (hide password)
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log("📡 Connecting to:", maskedUri);
    
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    
    // More helpful error messages
    if (error.message.includes('bad auth')) {
      console.log("   → Check your username and password");
    } else if (error.message.includes('getaddrinfo')) {
      console.log("   → Check your cluster name");
    } else if (error.message.includes('timed out')) {
      console.log("   → Network issue - check your internet/whitelist IP");
    } else if (error.message.includes('port number')) {
      console.log("   → This error is misleading. Your URI format is correct.");
      console.log("   → The issue might be with network access or credentials.");
    }
    
    return false;
  }
};

module.exports = connectDB; */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        // Test the connection
        const admin = conn.connection.db.admin();
        const info = await admin.serverInfo();
        console.log(`📦 MongoDB Version: ${info.version}`);
        
    } catch (error) {
        console.error('❌ MongoDB Connection Error Details:');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        
        if (error.name === 'MongoParseError') {
            console.error('\n🔧 FIX: Your MongoDB connection string is malformed.');
            console.error('Correct format: mongodb+srv://username:password@cluster.mongodb.net/database');
        } else if (error.name === 'MongoServerError') {
            if (error.code === 8000) {
                console.error('\n🔧 FIX: Authentication failed. Check username and password.');
            } else if (error.code === 18) {
                console.error('\n🔧 FIX: Authentication failed. Check if user has access to this database.');
            }
        } else if (error.message.includes('getaddrinfo')) {
            console.error('\n🔧 FIX: Network error. Check if cluster name is correct.');
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;