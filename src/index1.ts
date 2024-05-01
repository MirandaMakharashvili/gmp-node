import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const mongoose = require('mongoose');
const DB = process.env.DATABASE_LOCAL;

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connection successful!'))
    .catch((error: Error) => {
        console.log(`Error connecting to MongoDB: ${error.message}`);
    });

const app = express();
const port = 8000;

const cartRouter = require('./moduls/task6/routes/cartRouter');
const productsRouter = require('./moduls/task6/routes/productsRouter');

app.use(express.json());
app.use('/api/profile', cartRouter);
app.use('/api/products', productsRouter);

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
