const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'FundChain API is running!' });
});

// Mock data endpoints for MVP
app.get('/api/stats', (req, res) => {
  res.json({
    totalFunds: 2450000,
    activeCampaigns: 24,
    totalUsers: 1234,
    successRate: 87
  });
});

app.get('/api/transactions', (req, res) => {
  res.json([
    { id: 1, campaign: 'EcoTech Startup', amount: 50000, status: 'Completed' },
    { id: 2, campaign: 'HealthTech Innovation', amount: 75000, status: 'Pending' },
    { id: 3, campaign: 'Green Energy Project', amount: 120000, status: 'Completed' },
    { id: 4, campaign: 'AI Research Fund', amount: 90000, status: 'In Progress' }
  ]);
});

app.get('/api/campaigns', (req, res) => {
  res.json([
    { id: 1, name: 'EcoTech Startup', goal: 100000, raised: 50000, status: 'Active' },
    { id: 2, name: 'HealthTech Innovation', goal: 150000, raised: 75000, status: 'Active' },
    { id: 3, name: 'Green Energy Project', goal: 200000, raised: 120000, status: 'Active' },
    { id: 4, name: 'AI Research Fund', goal: 100000, raised: 90000, status: 'Active' }
  ]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`FundChain server running on port ${PORT}`);
});
