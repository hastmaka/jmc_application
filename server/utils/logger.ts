import { AsyncLocalStorage } from 'async_hooks';

// Store request context (requestId, userId, etc.)
export const requestContext = new AsyncLocalStorage<{
    requestId: string;
    userId?: number;
    ip?: string;
}>();

// Log levels
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    AUDIT: 4
} as const;

// Console colors
const COLORS = {
    DEBUG: '\x1b[36m',   // Cyan
    INFO: '\x1b[32m',    // Green
    WARN: '\x1b[33m',    // Yellow
    ERROR: '\x1b[31m',   // Red
    AUDIT: '\x1b[35m',   // Magenta
    DIM: '\x1b[2m',      // Dim
    RESET: '\x1b[0m'     // Reset
};

// Current log level (can be set via environment variable)
const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL as keyof typeof LOG_LEVELS] ?? LOG_LEVELS.DEBUG;

// Sensitive fields to redact from logs
const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'authorization', 'x-access-token'];

function sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key in sanitized) {
        if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof sanitized[key] === 'object') {
            sanitized[key] = sanitize(sanitized[key]);
        }
    }

    return sanitized;
}

function formatTimestamp(): string {
    return new Date().toISOString();
}

function getRequestId(): string {
    const ctx = requestContext.getStore();
    return ctx?.requestId || '-';
}

function formatMessage(level: keyof typeof LOG_LEVELS, message: string, meta?: any): string {
    const timestamp = formatTimestamp();
    const reqId = getRequestId();
    const color = COLORS[level];
    const reset = COLORS.RESET;
    const dim = COLORS.DIM;

    let output = `${dim}[${timestamp}]${reset} ${color}[${level.padEnd(5)}]${reset} ${dim}[${reqId}]${reset} ${message}`;

    if (meta) {
        const sanitizedMeta = sanitize(meta);
        output += ` ${dim}${JSON.stringify(sanitizedMeta)}${reset}`;
    }

    return output;
}

function log(level: keyof typeof LOG_LEVELS, message: string, meta?: any): void {
    if (LOG_LEVELS[level] < currentLevel) return;

    const formatted = formatMessage(level, message, meta);

    if (level === 'ERROR') {
        console.error(formatted);
    } else if (level === 'WARN') {
        console.warn(formatted);
    } else {
        console.log(formatted);
    }
}

export const logger = {
    debug: (message: string, meta?: any) => log('DEBUG', message, meta),
    info: (message: string, meta?: any) => log('INFO', message, meta),
    warn: (message: string, meta?: any) => log('WARN', message, meta),

    error: (message: string | Error, meta?: any) => {
        if (message instanceof Error) {
            const errorMeta = {
                ...meta,
                name: message.name,
                stack: message.stack
            };
            log('ERROR', message.message, errorMeta);
            // Print stack trace on separate lines for readability
            if (message.stack) {
                const stackLines = message.stack.split('\n').slice(1);
                stackLines.forEach(line => {
                    console.error(`${COLORS.DIM}${line}${COLORS.RESET}`);
                });
            }
        } else {
            log('ERROR', message, meta);
        }
    },

    audit: (action: string, meta?: {
        userId?: number;
        resource?: string;
        resourceId?: number | string;
        before?: any;
        after?: any;
        ip?: string;
    }) => {
        const ctx = requestContext.getStore();
        const auditMeta = {
            userId: meta?.userId || ctx?.userId,
            ip: meta?.ip || ctx?.ip,
            resource: meta?.resource,
            resourceId: meta?.resourceId,
            ...(meta?.before && { before: meta.before }),
            ...(meta?.after && { after: meta.after })
        };
        log('AUDIT', action, auditMeta);
    },

    // Log request start
    request: (method: string, url: string, meta?: { body?: any; query?: any; userId?: number }) => {
        const sanitizedMeta = meta ? {
            ...(meta.body && Object.keys(meta.body).length > 0 && { body: sanitize(meta.body) }),
            ...(meta.query && Object.keys(meta.query).length > 0 && { query: meta.query }),
            ...(meta.userId && { userId: meta.userId })
        } : undefined;

        log('INFO', `→ ${method} ${url}`, sanitizedMeta);
    },

    // Log response
    response: (statusCode: number, duration: number, meta?: any) => {
        const level = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARN' : 'INFO';
        log(level, `← ${statusCode} (${duration}ms)`, meta);
    }
};

// Generate unique request ID
export function generateRequestId(): string {
    return `req-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
}
