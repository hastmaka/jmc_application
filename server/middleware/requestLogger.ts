import { Request, Response, NextFunction } from 'express';
import { logger, requestContext, generateRequestId } from '../utils/logger.ts';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const requestId = generateRequestId();
    const startTime = Date.now();

    // Store context for this request
    const context = {
        requestId,
        userId: req.authUser?.user_id,
        ip: req.clientIp || req.ip
    };

    // Wrap the rest of the request in the async context
    requestContext.run(context, () => {
        // Log incoming request
        logger.request(req.method, req.originalUrl, {
            body: req.body,
            query: req.query as any,
            userId: req.authUser?.user_id
        });

        // Capture response
        const originalSend = res.send;
        res.send = function(body: any) {
            const duration = Date.now() - startTime;

            // Update context with user ID if it was set during request processing
            if (req.authUser?.user_id && !context.userId) {
                context.userId = req.authUser.user_id;
            }

            logger.response(res.statusCode, duration);

            return originalSend.call(this, body);
        };

        next();
    });
}

// Middleware to update context with auth user (call after RouteProcessor)
export function updateRequestContext(req: Request, _res: Response, next: NextFunction) {
    const store = requestContext.getStore();
    if (store && req.authUser?.user_id) {
        store.userId = req.authUser.user_id;
    }
    next();
}
