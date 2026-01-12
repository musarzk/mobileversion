import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), 'server', '.env');
dotenv.config({ path: envPath });

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

        console.log(`Checking DB: ${MONGODB_DB}, Collection: properties`);

        const properties = await collection.find({}).limit(5).toArray();

        if (properties.length === 0) {
            console.log('❌ No properties found');
        } else {
            console.log('✅ Writing keys to debug_keys_clean.txt');
            const fs = require('fs');
            fs.writeFileSync('debug_keys_clean.txt', JSON.stringify(Object.keys(properties[0]), null, 2));
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

debugProperties();
