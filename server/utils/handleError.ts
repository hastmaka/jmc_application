import { Response } from 'express';
import { logger } from './logger.ts';

export function handleError(res: Response, error: any, code: number = 400): void {
    const message = error?.message || error;

    // Log the error with full details
    if (error instanceof Error) {
        logger.error(error, { code, field: (error as any)?.field });
    } else {
        logger.error(typeof error === 'string' ? error : 'Unknown error', {
            code,
            field: error?.field,
            error
        });
    }

    res.status(code).json({
        status: code,
        message,
        field: error?.field || null,
        existingId: error?.existingId || null,
        success: false
    });
}