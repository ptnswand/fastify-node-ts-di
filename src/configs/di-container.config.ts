import { container } from "tsyringe";
import { AppServer } from "../app.server";
import AppDataSource from "./orm.config";

// Register database service
container.register("DataSource", {
    useValue: AppDataSource
});

// Register app server
container.registerSingleton(AppServer)