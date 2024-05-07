import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

const xss = require('xss-clean');
const morgan = require('morgan');

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

const app = express();
const port = 8000;

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

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
