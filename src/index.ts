import express from 'express';

const app = express();
const port = 8000;

const cartRouter = require('./moduls/task6/routes/cartRouter');
const productsRouter = require('./moduls/task6/routes/productsRouter');

app.use(express.json());
app.use('/api/profile', cartRouter);
app.use('/api/products', productsRouter);

app.listen(port,() => {
    console.log(`App running on port ${port}...`);
}); 