import 'express';

declare module 'express-serve-static-core' {
    interface Request {
        clientIp: string;
        user?: any;
        user_uid?: string;
        lastIp?: string;
        authUser: Record<string, any>;
    }
}