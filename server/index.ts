import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import userRoutes from './routes/users';

import investorRoutes from './routes/investor-properties';

// Load environment variables using absolute path
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; color: #111827;">
      <h1 style="color: #0066cc;">🚀 Dwellas Mobile API</h1>
      <p>Server is running successfully in production!</p>
      <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <strong>Endpoints:</strong>
        <ul style="margin-top: 10px;">
          <li>Health Check: <a href="/health">/health</a></li>
          <li>Properties: <a href="/api/properties">/api/properties</a></li>
        </ul>
      </div>
    </div>
  `);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/investor-properties', investorRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mobile API Server running on port ${PORT}`);
  console.log(`📡 Accessible from:`);
  console.log(`   - Localhost: http://localhost:${PORT}`);
  console.log(`   - Android Emulator: http://10.0.2.2:${PORT}`);
  console.log(`   - Physical Device: http://192.168.100.2:${PORT}`);
  console.log(`\n💡 For physical devices:`);
  console.log(`   1. Make sure your phone is on the same WiFi network`);
  console.log(`   2. Use http://192.168.100.2:${PORT}/api in the mobile app`);
  console.log(`   3. Test connection: http://192.168.100.2:${PORT}/health`);
});
