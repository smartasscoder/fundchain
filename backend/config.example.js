module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Database Configuration (for future use)
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fundchain',
  
  // Blockchain Configuration
  ethereumNetwork: process.env.ETHEREUM_NETWORK || 'localhost',
  contractAddress: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  
  // Rate Limiting
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000,
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 100
};
