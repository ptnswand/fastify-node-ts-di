import { FastifyRequest, FastifyReply } from "fastify";
import { CREATED, NO_CONTENT, OK } from "../http-code.config";

// Define a symbol metadata key for route information
export const HTTP_ROUTE_PATH = Symbol("http:routes");

// Define a symbol metadata key for request transformer
export const REQUEST_TRANSFORMER = Symbol("request:transform")

type HTTPVerb = "get" | "post" | "patch" | "delete";

export type ControllerRoute = {
    method: HTTPVerb;
    path: string;
    name: string;
};

// Decorator function for HTTP request
export function HTTPRequest(verb: HTTPVerb, path: string, code?: number) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        /**
         * Set route path
         */
        const route: ControllerRoute = {
            method: verb,
            path: path.toLowerCase(),
            name: propertyKey,
        };

        Reflect.defineMetadata(HTTP_ROUTE_PATH, route, target, propertyKey);

        /**
         * Apply transformations for request data transfer to object
         */
        const method = descriptor.value;

        descriptor.value = async function (
            request: FastifyRequest,
            reply: FastifyReply,
        ) {
            // get transform function from metadata
            const transformFn = Reflect.getOwnMetadata(
                REQUEST_TRANSFORMER,
                target,
                propertyKey // property name
            );

            // transform request if fn exists
            if (transformFn) {
                request = transformFn(request);
            }

            // apply transformed request
            if (code) {
                try {
                    const data = await method.apply(this, [request, reply]);
                    reply.code(code).send({ code, data })
                } catch (error: any) {
                    const statusCode = error?.statusCode || 500
                    const message = error?.message || 'Internal Server Error'

                    reply.status(statusCode).send({
                        code: statusCode,
                        message,
                    });
                }
            } else {
                method.apply(this, [request, reply])
            }
        };

        return descriptor;
    };
}

/**
 * Decorator function for GET requests
 * @param path HTTP route path
 * @param code -
 * - HTTP status code when success default `201`
 * - set `code` to `RES` to custom response
 * ```
 * this.anyService()
 * * * .then(data => {
 * * * * * data.write(res)
 * * * * * // or this way
 * * * * * res.pipe(data)
 * * * }).catch(next)
 * // or usual way
 * try { 
 * const result = await this.anyService(); 
 * res.status(xxx).json(result) 
 * } catch (error) { next(error) }
 * ```
 */
export function Get(path: string, code: number | 'RES' = OK) {
    return HTTPRequest("get", path, code === 'RES' ? undefined : code);
}

/**
 * Decorator function for POST requests
 * @param path HTTP route path
 * @param code -
 * - HTTP status code when success default `201`
 * - set `code` to `RES` to custom response
 * ```
 * this.anyService()
 * * * .then(data => {
 * * * * * data.write(res)
 * * * * * // or this way
 * * * * * res.pipe(data)
 * * * }).catch(next)
 * // or usual way
 * try { 
 * const result = await this.anyService(); 
 * res.status(xxx).json(result) 
 * } catch (error) { next(error) }
 * ```
 */
export function Post(path: string, code: number | 'RES' = CREATED) {
    return HTTPRequest("post", path, code === 'RES' ? undefined : code);
}

/**
 * Decorator function for PATCH requests
 * @param path HTTP route path
 * @param code  -
 * - HTTP status code when success default `201`
 * - set `code` to `RES` to custom response
 * ```
 * this.anyService()
 * * * .then(data => {
 * * * * * data.write(res)
 * * * * * // or this way
 * * * * * res.pipe(data)
 * * * }).catch(next)
 * // or usual way
 * try { 
 * const result = await this.anyService(); 
 * res.status(xxx).json(result) 
 * } catch (error) { next(error) }
 * ```
 */
export function Patch(path: string, code: number | 'RES' = OK) {
    return HTTPRequest("patch", path, code === 'RES' ? undefined : code);
}

/**
 * Decorator function for DELETE requests
 * @param path HTTP route path
 * @param code  -
 * - HTTP status code when success default `201`
 * - set `code` to `RES` to custom response
 * ```
 * this.anyService()
 * * * .then(data => {
 * * * * * data.write(res)
 * * * * * // or this way
 * * * * * res.pipe(data)
 * * * }).catch(next)
 * // or usual way
 * try { 
 * const result = await this.anyService(); 
 * res.status(xxx).json(result) 
 * } catch (error) { next(error) }
 * ```
 */
export function Delete(path: string, code: number | 'RES' = NO_CONTENT) {
    return HTTPRequest("delete", path, code === 'RES' ? undefined : code);
}

/**
 * Define a decorator factory function for data transfer object (DTO)
 * @param fn transform & validate request function
 */
export function DTO<T = any>(fn: (request: Request) => T): ParameterDecorator {
    return (target: any, propertyKey: string | symbol | undefined) => {
        if (!propertyKey) return;

        Reflect.defineMetadata(REQUEST_TRANSFORMER, fn, target, propertyKey);
    };
}