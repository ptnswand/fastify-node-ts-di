import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import Fastify, { FastifyInstance } from 'fastify'
import { container, inject, singleton } from "tsyringe";
import { CONTROLLER_ROUTE_PATH, CONTROLLER_REPOSITORIES } from './configs/decorators/app-registry.decorator';
import { ControllerRoute, HTTP_ROUTE_PATH } from './configs/decorators/http-request.decorator';
import { DataSource } from 'typeorm';
import RequestHook from "./configs/middlewares/request.middleware";
import FinishedHook from "./configs/middlewares/finished.middleware";
import { Logger } from "./configs/logger.config";

@singleton()
export class AppServer {
    private PORT = Number(process.env.PORT) || 3000

    private server: FastifyInstance

    private controllers: unknown[] = [];

    constructor(@inject("DataSource") private datasource: DataSource) {
        this.server = Fastify()
    }

    public async InitializeAppServer(controllers: unknown[]) {
        // define consumable controllers
        this.controllers = controllers;

        try {
            await this.datasource.initialize();
            Logger.Success("Intialize Database Successful");

            return this.pluginMiddlewares();
        } catch (error) {
            Logger.Error(JSON.stringify(error));
            process.exit(1);
        }
    }

    private pluginMiddlewares() {
        this.server.register(cors)
        this.server.register(helmet)
        this.server.addHook('onRequest', RequestHook)
        this.server.addHook('onSend', FinishedHook);
        // this.server.use(AuthParser)

        return this.registerControllers();
    }

    private registerControllers() {
        // Register all controllers
        this.controllers?.forEach((controller: any) => {
            // Register container
            container.registerSingleton(controller);

            const controllerPaht = Reflect.getMetadata(
                CONTROLLER_ROUTE_PATH,
                controller
            );

            const repositories = Reflect.getMetadata(
                CONTROLLER_REPOSITORIES,
                controller
            );

            // register all repositories
            if (repositories?.length > 0) {
                repositories.forEach(async ({ repo, entity }: any) => {

                    // register Entity Repository if not registered
                    if (!container.isRegistered(repo.name)) {
                        const repoMethods = this.extractRepositoryMethods(repo, entity)

                        container.register(repo.name, {
                            useValue: this.datasource.getRepository(entity).extend(repoMethods),
                        });
                    }
                });
            }

            // Register routes
            const instance: any = container.resolve(controller);
            const prototype = Object.getPrototypeOf(instance);

            Object.getOwnPropertyNames(prototype).forEach((methodName) => {
                const route: ControllerRoute = Reflect.getMetadata(
                    HTTP_ROUTE_PATH,
                    prototype,
                    methodName
                );

                if (route) {
                    // custom controller path
                    const path = controllerPaht
                        ? `/${controllerPaht}/${route.path}`.replace(
                            /(\/\/)/g,
                            "/"
                        )
                        : route.path;

                    // add router and method each path
                    this.server[route.method](
                        path.toLocaleLowerCase(),
                        (req, rep) => {
                            instance[route.name](req, rep);
                        }
                    );
                }
            });
        });

        return this.start();
    }

    private extractRepositoryMethods(repo: any, entity: any) {
        const methods = Object.getOwnPropertyNames(repo.prototype).filter(
            methodName => methodName !== 'constructor'
        );

        return methods.reduce((obj, methodName) => {
            obj[methodName] = repo.prototype[methodName]
                .bind(this.datasource.getRepository(entity));
            return obj;
        }, {} as any);
    }

    private start(): void {
        this.server.listen({ port: this.PORT }, (err, address) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
            console.log(`Server listening at ${address.replace('[::1]', '127.0.0.1')}`)
        })
    }
}