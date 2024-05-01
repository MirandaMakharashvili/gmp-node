import {MikroORM} from "@mikro-orm/core";
import {EntityManager, PostgreSqlDriver} from "@mikro-orm/postgresql";
import ormConfig from "./config/orm.config";

export const container = {} as {
    orm: MikroORM,
    em: EntityManager,
};

export const init = async () =>{
    const orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);

    const migrator = orm.getMigrator();
    await migrator.up();

    container.orm = orm;
    container.em = orm.em;
}
