const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, 'server', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'appdb';

async function debugProperties() {
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not defined');
        return;
    }

    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db(MONGODB_DB);
        const collection = db.collection('properties');
        
        const properties = await collection.find({}).limit(1).toArray();
        
        if (properties.length === 0) {
            console.log('❌ No properties found');
        } else {
            console.log('✅ Writing keys to debug_keys_clean.txt');
            fs.writeFileSync('debug_keys_clean.txt', JSON.stringify(Object.keys(properties[0]), null, 2));
            console.log('✅ Done writing.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

debugProperties();
