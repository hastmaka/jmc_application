import { Server as HTTPServer } from 'http';
import { Server as HTTPSServer } from 'https';
import { Server as SocketIOServer, Socket } from 'socket.io';
import IO from '../classes/IO.ts';

export interface SessionSocket extends Socket {
    sessionId?: string;
    businessId?: number;
}

let ioHandler: IO;

export function setupSocketIO(server: HTTPServer | HTTPSServer): IO {
    const io = new SocketIOServer(server, {
        cors: {
            origin: '*',
        },
    });

    ioHandler = new IO(io);

    io.use((socket: SessionSocket, next) => {
        const { sessionId, businessId } = socket.handshake.auth;

        if (sessionId) {
            const session = ioHandler.findSession(sessionId);
            if (session) {
                socket.sessionId = sessionId;
                socket.businessId = session.businessId;
                return next();
            }
        }

        if (!businessId) return next(new Error('Missing businessId'));

        socket.sessionId = socket.id;
        socket.businessId = +businessId;
        next();
    });

    io.on('connection', (socket: SessionSocket) => {
        ioHandler.saveSession(socket.businessId!, socket.id);

        ioHandler.emitToUser(socket.id, 'session', {
            sessionId: socket.id,
            businessId: socket.businessId,
        });

        console.log(`-->> socket connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`<<-- socket disconnected: ${socket.id}`);
        });
    });

    return ioHandler;
}