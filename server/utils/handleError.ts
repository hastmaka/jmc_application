import { Response } from 'express';

export function handleError(res: Response, error: any, code: number = 400): void {
    const message = error?.message || error;

    res.status(code).json({
        status: code,
        message,
        field: error?.field || null,
        success: false
    });
}