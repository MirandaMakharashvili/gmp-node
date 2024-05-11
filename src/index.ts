import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import http from 'http';
import morgan from 'morgan';
import winston from 'winston';

const app = express();

const level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const logger = winston.createLogger({
    level: level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()} ${message}`;
        }),
    ),
    transports: [new winston.transports.Console()],
});

const morganFormat = ':date[web] :level :method :url - :response-time ms';
morgan.token('date', () => new Date().toISOString());
morgan.token('level', () => 'INFO');

app.use(
    morgan(morganFormat, {
        stream: { write: (message: string) => logger.info(message) },
    }),
);

const xss = require('xss-clean');

const mongoose = require('mongoose');
const DB = process.env.DATABASE_LOCAL;

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connection successful!'))
    .catch((error: Error) => {
        console.log(`Error connecting to MongoDB: ${error.message}`);
    });

app.get('/healthcheck', (req: Request, res: Response) => {
    if (mongoose.connection.readyState === 1) {
        res.status(200).json({
            message: 'Application is healthy',
        });
    } else {
        res.status(500).json({
            message: 'Application is not healthy',
        });
    }
});

const server = http.createServer(app);
const port = process.env.APP_PORT || 8000;

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const cartRouter = require('./moduls/task8/routes/cartRouter');
const productsRouter = require('./moduls/task8/routes/productsRouter');
const auth = require('./moduls/task9/routes/userRoutes');

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(
    hpp({
        whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'],
    }),
);

app.use((req: Request, res: Response, next: NextFunction) => {
    req.body.requestTime = new Date().toISOString();
    next();
});

app.use('/api/profile', cartRouter);
app.use('/api/products', productsRouter);
app.use('/api/auth', auth);

server.listen(port, () => {
    logger.info(`App running on port ${port}...`);
});

process.on('unhandledRejection', (error: Error) => {
    logger.error('Unhandled rejection! Shutting down...');
    logger.error(error.name, error.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    logger.info('Sigterm received. Shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated!');
    });
});
