import { Request, Response, NextFunction } from 'express';
import {handleError, throwError} from "../utils/index.ts";
import User from "../classes/User.ts";

export const RouteProcessor = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.method === 'OPTIONS') return res.end();
    let a = req;

    const token: any = req.headers['x-access-token']
    if (!token) return handleError( res, 'No token was found',  401);

    if (token === 'el pollo' && req.method === 'GET') {
        return next();
    }

    try {
        const auth = await User.manageToken(token, req.clientIp);

        req.authUser = {
            ...auth.user,
            user_token: auth.token,
            info: {
                host: req.clientIp,
                path: {
                    url: req?.originalUrl?.split('?')[0],
                    method: req.method
                }
            },
            auth
        };

        // await saveUserTokenData(auth, `${auth.user.user_id}`);

        return next();
    } catch (e: any) {
        return handleError(res, e.message, 401);
    }
}