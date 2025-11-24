/**
 * AWS Lambda Handler
 * 
 * Wraps the Express app for deployment to AWS Lambda.
 * Uses aws-serverless-express to translate API Gateway events to Express requests.
 */

import awsServerlessExpress from 'aws-serverless-express';
import app from './server';
import { logInfo } from './utils/logger';

// Create Lambda-compatible server
const server = awsServerlessExpress.createServer(app);

/**
 * Lambda handler function
 * This is the entry point when deployed to AWS Lambda
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = (event: any, context: any) => {
  logInfo('Lambda invocation', {
    requestId: context.requestId,
    functionName: context.functionName,
    httpMethod: event.httpMethod,
    path: event.path,
  });
  
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
