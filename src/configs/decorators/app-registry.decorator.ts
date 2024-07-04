import { container, inject, injectable, singleton } from "tsyringe";
import { HttpError } from "../error.config";
import { DataSource } from "typeorm";

// Define a symbol metadata key for register controller's path 
export const CONTROLLER_ROUTE_PATH = Symbol("controller:path");

// Define a symbol metadata key for register controller's entities 
export const CONTROLLER_REPOSITORIES = Symbol("controller:repositories");

// Define a symbol metadata key for register service's repositories 
export const SERVICE_REPOSITORIES = Symbol("service:repositories");

// Define a symbol metadata key for register service's entities 
export const SERVICE_ENTITIES = Symbol("service:entities");

/**
 * determine a app's Controller decorator
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
                        // get injected repositories each service
                        const repositories = Reflect.getMetadata(
                            SERVICE_REPOSITORIES,
                            service
                        );

                        // set entities from service if exists
                        if (repositories) {
                            controllerEntities.push(...repositories);
                        }
                    });

                    // set controller entities to metadata key
                    Reflect.defineMetadata(
                        CONTROLLER_REPOSITORIES,
                        controllerEntities,
                        target
                    );
                }
            }
        });
    };
}

/**
 * determine a Service decorator 
 */
export function Service(): ClassDecorator {
    return function (target: any) {
        injectable()(target); // Make the class injectable
    };
}

// Define a Custom Repository class decorator
export function CustomRepository(entity: any): ClassDecorator {
    return function (target: any) {
        Reflect.defineMetadata(SERVICE_ENTITIES, entity, target);
    }
}

// Define a custom Inject Repository for parameter decorator
export function InjectRepository(repo: Function): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) {
        let repositories = Reflect.getMetadata(
            SERVICE_REPOSITORIES,
            target
        );

        const entity = Reflect.getMetadata(
            SERVICE_ENTITIES,
            repo
        )

        repositories = repositories ? [...repositories, { repo, entity }] : [{ repo, entity }]
        Reflect.defineMetadata(SERVICE_REPOSITORIES, repositories, target);

        inject(repo.name)(target, propertyKey, parameterIndex);
    };
}