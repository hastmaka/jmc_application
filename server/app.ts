import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';
import requestIp from 'request-ip';
import {setupSocketIO} from "./socket/socket.ts";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(requestIp.mw());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '100mb'
}));

const corsOptions = {
    origin: '*',
    methods: "GET,PUT,POST,OPTIONS,DELETE",
    allowedHeaders: ['Content-Type', 'X-Access-Token', 'X-Requested-With'],
    credentials: true,
    maxAge: 3600
};

app.use(cors(corsOptions));

// Middleware to log every request
app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// this is only to check health
import routes from './routes/index.ts';
app.use('/api', routes);

import Car from './routes/car/index.ts';
import User from './routes/user/index.ts';
import Asset from './routes/asset/index.ts';
import AssetOption from './routes/assetOption/index.ts';
import Reservation from './routes/reservation/index.ts';
import Employee from './routes/employee/index.ts';
import Notification from './routes/notification/index.ts';
import Document from './routes/document/index.ts';
import Inspection from './routes/inspection/index.ts';
import {RouteProcessor} from "./middleware/ValidateRequest.ts";

app.use('/api/login', User);

app.use('/api/v1', RouteProcessor as any);

app.use('/api/v1/asset', Asset);
app.use('/api/v1/asset-option', AssetOption);
app.use('/api/v1/user', User);
app.use('/api/v1/reservation', Reservation);
app.use('/api/v1/employee', Employee);
app.use('/api/v1/car', Car);
app.use('/api/v1/notification', Notification);
app.use('/api/v1/document', Document);
app.use('/api/v1/inspection', Inspection);


const httpServer = http.createServer(app);
setupSocketIO(httpServer);
httpServer.listen(80, () => {
    console.log('HTTP Server running on http://localhost:80/');
});