export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/swiftmint',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
  logLevel: process.env.LOG_LEVEL || 'info',
  currencyApiKey: process.env.CURRENCY_API_KEY || '',
  paymentProviderKey: process.env.PAYMENT_PROVIDER_KEY || '',
};
