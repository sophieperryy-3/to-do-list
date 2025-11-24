/**
 * Express Server
 * 
 * Main application server setup.
 * Can run standalone (for local dev) or wrapped by Lambda (for production).
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './utils/config';
import { logInfo, logError } from './utils/logger';
import taskRoutes from './routes/tasks';

// Create Express app
const app = express();

/**
 * Middleware: Request ID generation
 * Every request gets a unique ID for tracing through logs
 */
app.use((req: Request, _res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  next();
});

/**
 * Middleware: Request logging
 * Log every incoming request with method, path, and request ID
 */
app.use((req: Request, _res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestId = (req as any).requestId;
  logInfo('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
  });
  next();
});

/**
 * Middleware: CORS
 * Allow cross-origin requests from frontend
 */
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

/**
 * Middleware: JSON body parser
 */
app.use(express.json());

/**
 * Health check endpoint
 * Used by load balancers and monitoring systems
 */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

/**
 * API Routes
 */
app.use('/tasks', taskRoutes);

/**
 * 404 handler
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

/**
 * Global error handler
 * Catches any unhandled errors and returns a 500 response
 */
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestId = (req as any).requestId;
  logError('Unhandled error', err, { requestId, path: req.path });
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

/**
 * Start server (only when not running in Lambda)
 */
if (!config.isLambda) {
  app.listen(config.port, () => {
    logInfo(`Server started on port ${config.port}`, {
      environment: config.nodeEnv,
      port: config.port,
    });
  });
}

export default app;
