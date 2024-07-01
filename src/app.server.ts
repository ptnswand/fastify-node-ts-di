import Fastify, { FastifyInstance } from 'fastify'
import { container, singleton } from "tsyringe";
import { CONTROLLER_ROUTE_PATH, CONTROLLER_ENTITIES } from './configs/decorators/app-registry.decorator';
import { ControllerRoute, HTTP_ROUTE_INFO } from './configs/decorators/http-request.decorator';

@singleton()
export class AppServer {
    private PORT = Number(process.env.PORT) || 3000

    private server: FastifyInstance

    private controllers: unknown[] = [];

    constructor() {
        this.server = Fastify()
    }

    public InitializeAppServer(controllers: unknown[]) {
        // define consumable controllers
        this.controllers = controllers;

        return this.registerControllers()
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

            // const entities = Reflect.getMetadata(
            //     CONTROLLER_ENTITIES,
            //     controller
            // );

            // register all entity repositories
            // if (entities?.length > 0) {
            //     entities.forEach((entity: any) => {
            //         try {
            //             // check entity was registered or not?
            //             container.resolve(`${entity.name}Repository`);
            //         } catch (error) {
            //             // if not, register a new one
            //             container.register(`${entity.name}Repository`, {
            //                 useFactory: () =>
            //                     this.datasource.getRepository(entity),
            //             });
            //         }
            //     });
            // }

            // Register routes
            const instance: any = container.resolve(controller);
            const prototype = Object.getPrototypeOf(instance);

            Object.getOwnPropertyNames(prototype).forEach((methodName) => {
                const route: ControllerRoute = Reflect.getMetadata(
                    HTTP_ROUTE_INFO,
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