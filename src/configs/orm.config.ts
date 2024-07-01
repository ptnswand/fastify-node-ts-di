import { DataSource } from "typeorm";
import { join  } from 'path'
import * as dotenv from "dotenv"

dotenv.config()

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [
        join(__dirname, "../entities/*.entity.ts"),
        join(__dirname, "../entities/*.entity.js")
    ],
    /**
     * !!! TLDR; !!!
     * Build app first. Migration work only with .js file.
     * 
     * !!! NOTE !!!
     *  Require build app before run command. The typeorm migration
     *  can't see orm.config as Typescript file. Thus JUST build the app
     */
    migrations: [join(__dirname, "../migrations/*.js")],
    migrationsRun: false,
    migrationsTableName: 'history',
    logging: false,
    synchronize: false,
})

export default AppDataSource