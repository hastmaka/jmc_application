import { Server, Socket } from 'socket.io';

type Session = any;

class IO {
    private io: Server;
    private sessions: Map<string, Session>;
    private rooms: Map<string, string[]>;

    constructor(io: Server) {
        this.io = io;
        this.sessions = new Map();
        this.rooms = new Map();
    }

    findSession(id: string): Session | undefined {
        return this.sessions.get(id);
    }

    saveSession(id: string | number, session: Session): void {
        this.sessions.set(id.toString(), session);
    }

    deleteSession(id: string): void {
        this.sessions.delete(id);
    }

    findAllSessions(): Session[] {
        return [...this.sessions.values()];
    }

    joinRoom(socketId: string, roomName: string): void {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
            socket.join(roomName);
            if (!this.rooms.has(roomName)) {
                this.rooms.set(roomName, []);
            }
            this.rooms.get(roomName)!.push(socketId);
        }
    }

    leaveRoom(socket: Socket, roomName: string): void {
        socket.leave(roomName);
        if (this.rooms.has(roomName)) {
            const sockets = this.rooms.get(roomName)!;
            const index = sockets.indexOf(socket.id);
            if (index !== -1) {
                sockets.splice(index, 1);
                if (sockets.length === 0) {
                    this.rooms.delete(roomName);
                }
            }
        }
    }

    emitToRoom(eventName: string, roomName: string, data: any): void {
        this.io.to(roomName).emit(eventName, data);
    }

    emitToUser(id: string, eventName: string, data: any): void {
        this.io.to(id).emit(eventName, data);
    }
}

export default IO;