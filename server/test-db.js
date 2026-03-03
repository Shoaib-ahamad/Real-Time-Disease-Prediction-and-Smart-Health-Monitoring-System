const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
    console.log('🔍 Testing MongoDB connection...');
    console.log('Connection string (password hidden):', 
        process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));
    
    const client = new MongoClient(process.env.MONGO_URI);
    
    try {
        await client.connect();
        console.log('✅ Connected successfully!');
        
        // Test by listing databases
        const dbs = await client.db().admin().listDatabases();
        console.log('📊 Available databases:', dbs.databases.map(db => db.name));
        
        // Test healthDB specifically
        const db = client.db('healthDB');
        const collections = await db.listCollections().toArray();
        console.log('📁 Collections in healthDB:', collections.map(c => c.name));
        
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        if (error.message.includes('Authentication failed')) {
            console.error('\n🔧 Common fixes:');
            console.error('1. Check username and password in .env file');
            console.error('2. Make sure the user exists in MongoDB Atlas (Database Access)');
            console.error('3. Verify the user has access to healthDB database');
            console.error('4. Try creating a new database user in Atlas');
        }
    } finally {
        await client.close();
    }
}

testConnection();