import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), 'server', '.env');
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI;

async function test() {
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not defined');
        return;
    }

    const client = new MongoClient(MONGODB_URI);
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const dbs = ['Realdb', 'Realbase'];
        const email = 'mucerabdool@gmail.com';

        for (const dbName of dbs) {
            console.log(`--- Checking DB: ${dbName} ---`);
            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            console.log('Collections:', collections.map(c => c.name));
            
            if (collections.some(c => c.name === 'users')) {
                const users = db.collection('users');
                const user = await users.findOne({ email: { $regex: `^${email}$`, $options: 'i' } });
                
                if (user) {
                    console.log(`✅ User found in ${dbName}:`, {
                        email: user.email,
                        role: user.role,
                        approved: user.approved
                    });
                } else {
                    console.log(`❌ User not found in ${dbName}`);
                }
            } else {
                console.log(`❌ No users collection in ${dbName}`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

test();
