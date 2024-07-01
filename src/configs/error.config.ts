import {
    BAD_REQUEST,
    INTERNAL_SERVER,
    NOT_FOUND,
    UNAUTHORIZED,
} from "./http-code.config";

/**
 * HttpError class for throwing each type or error
 */
export class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpError.prototype);
    }

    /**
     * The server could not understand the request due to invalid syntax
     */
    static BadRequest(message = "Bad Request") {
        return new HttpError(message, BAD_REQUEST);
    }

    /**
     * The client must authenticate itself to get the requested response
     */
    static Unauthorized(message = "Unauthorized") {
        return new HttpError(message, UNAUTHORIZED);
    }

    /**
     * The server can not find the requested resource
     */
    static NotFound(message = "Not Found") {
        return new HttpError(message, NOT_FOUND);
    }

    /**
     * The server has encountered a situation it doesn't know how to handle
     */
    static InternalServer(message = "Internal Server") {
        return new HttpError(message, INTERNAL_SERVER);
    }
}