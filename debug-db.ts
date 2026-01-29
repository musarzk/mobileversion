import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dwelas";

async function inspectDB() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to DB");
    const db = client.db();
    const collection = db.collection('properties');
    
    // Get distinct values for filterable fields
    const types = await collection.distinct('propertyType');
    const listingTypes = await collection.distinct('listingType');
    
    // Get one raw document
    const sample = await collection.findOne({});

    const output = `
--- DISTINCT VALUES ---
propertyType: ${JSON.stringify(types)}
listingType: ${JSON.stringify(listingTypes)}

--- SAMPLE DOCUMENT ---
${JSON.stringify(sample, null, 2)}
    `;
    
    fs.writeFileSync('db-dump.log', output);
    console.log("Dumped to db-dump.log");

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

inspectDB();
