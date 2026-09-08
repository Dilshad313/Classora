import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import path from 'path';

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Capture the original res.end method to log after response is sent
  const originalEnd = res.end;
  
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    
    // Log request info
    console.log({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'Unknown',
      statusCode: res.statusCode,
      durationMs: duration,
      ...(req.user && { userId: req.user._id })
    });
    
    // Call original res.end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

/**
 * Error logging middleware
 */
export const errorLogger = (error, req, res, next) => {
  console.error({
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent') || 'Unknown',
    ...(req.user && { userId: req.user._id })
  });
  
  next(error);
};

/**
 * File-based logger for important events.
 *
 * On serverless platforms (Vercel, AWS Lambda) the deployment bundle
 * (e.g. /var/task) is read-only, so we never write logs there. In that
 * environment we log to the console instead, which Vercel captures.
 * Outside serverless, we keep writing to a local ./logs directory.
 */
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

export class FileLogger {
  constructor(filename = 'app.log') {
    this.useConsoleOnly = isServerless;

    if (!this.useConsoleOnly) {
      this.logPath = path.join(process.cwd(), 'logs', filename);

      // Ensure logs directory exists
      const logsDir = path.dirname(this.logPath);
      try {
        if (!fs.existsSync(logsDir)) {
          fs.mkdirSync(logsDir, { recursive: true });
        }
      } catch (err) {
        // Filesystem isn't writable (e.g. unexpected read-only host) — fall back to console.
        console.warn('FileLogger: falling back to console logging, could not create logs directory:', err.message);
        this.useConsoleOnly = true;
      }
    }
  }

  log(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      pid: process.pid
    };

    if (this.useConsoleOnly) {
      const line = JSON.stringify(logEntry);
      if (level === 'ERROR') {
        console.error(line);
      } else {
        console.log(line);
      }
      return;
    }

    fs.appendFileSync(this.logPath, JSON.stringify(logEntry) + '\n');
  }

  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  error(message, meta = {}) {
    this.log('ERROR', message, meta);
  }

  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }
}

// Create a global logger instance
export const fileLogger = new FileLogger();