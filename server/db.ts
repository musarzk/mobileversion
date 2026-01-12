import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables using absolute path
dotenv.config({ path: path.resolve(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'appdb';

if (!MONGODB_URI) {
  throw new Error('❌ Missing environment variable: MONGODB_URI');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  try {
    const client = new MongoClient(MONGODB_URI!);
    await client.connect();
    const db = client.db(MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

export async function getCollection(name: string): Promise<Collection> {
  const db = await getDb();
  return db.collection(name);
}
