/**
 * Configuration Management
 * 
 * All configuration comes from environment variables, never hard-coded.
 * This follows 12-factor app principles and enables different configs per environment.
 */

export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // AWS configuration
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  dynamodbTableName: process.env.DYNAMODB_TABLE_NAME || 'todo-tasks-dev',
  
  // Logging configuration
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*', // In production, set to specific frontend URL
  
  // Feature flags
  isLambda: process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined,
};

/**
 * Validate that required environment variables are set
 * This runs at startup to fail fast if misconfigured
 */
export function validateConfig(): void {
  const required = ['DYNAMODB_TABLE_NAME'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please set these in your environment or .env file'
    );
  }
}
