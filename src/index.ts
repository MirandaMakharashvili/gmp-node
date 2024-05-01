import { EntityManager, MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import express from 'express';
import config from './config/orm.config';
import { container, init } from './init';

/* export const container = {} as {
    orm: MikroORM;
    em: EntityManager;
};

const init = async () => {
    const orm = await MikroORM.init<PostgreSqlDriver>(config);

    const migrator = orm.getMigrator();
    await migrator.up();

    container.orm = orm;
    container.em = orm.em;
}; */

init()
    .then(() => {
        const app = express();
        const port = 8000;
        const cartRouter = require('./moduls/task6/routes/cartRouter');
        const productsRouter = require('./moduls/task6/routes/productsRouter');

        app.use(express.json());
        app.use((req, res, next) => RequestContext.create(container.orm.em, next));

        app.use('/api/profile', cartRouter);
        app.use('/api/products', productsRouter);

        app.listen(port, () => {
            console.log(`App running on port ${port}...`);
        });
    })
    .catch((err) => {
        console.error('Unable to initialize MikroORM or start the server:', err);
    });
  