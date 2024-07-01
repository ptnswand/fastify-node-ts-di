import { injectable, singleton } from "tsyringe";

// Define a symbol metadata key for register controller's path 
export const CONTROLLER_ROUTE_PATH = Symbol("controller-path");

// Define a symbol metadata key for register controller's entities 
export const CONTROLLER_ENTITIES = Symbol("controller-entities");

// Define a symbol metadata key for register service's entities 
export const SERVICE_ENTITIES = Symbol("service-entities");

/**
 * determine a app's controller
 * 
 * @param path controller's route path
 */
export function Controller(path?: string): ClassDecorator {
    return (target: any) => {
        // Set default controller path
        if (path) {
            Reflect.defineMetadata(CONTROLLER_ROUTE_PATH, path, target);
        }

        singleton()(target); // Make the class injectable once

        const metadataKeys = Reflect.getMetadataKeys(target);

        metadataKeys.forEach((key: string) => {
            if (key === "design:paramtypes") {
                const services = Reflect.getMetadata(key, target);

                if (services?.length > 0) {
                    const controllerEntities: any = [];

                    services.forEach((service: any) => {
                        // container.register(s, { useClass: s });
                        const entities = Reflect.getMetadata(
                            SERVICE_ENTITIES,
                            service
                        );
                        // set entities from service if exists
                        if (entities) {
                            controllerEntities.push(...entities);
                        }
                    });

                    // set controller entities to metadata key
                    Reflect.defineMetadata(
                        CONTROLLER_ENTITIES,
                        controllerEntities,
                        target
                    );
                }
            }
        });
    };
}

/**
 * determine a controller's service
 * 
 * @param entities register entities when using repository
 */
export function Service(entities?: any[]): ClassDecorator {
    return (target: any) => {
        injectable()(target); // Make the class injectable

        if (entities) {
            // set service entities to metadata key
            Reflect.defineMetadata(SERVICE_ENTITIES, entities, target);
        }
    };
}