import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { Logger } from "../logger.config";

const FinishedHook = (
    request: FastifyRequest,
    reply: FastifyReply,
    payload: string,
    done: DoneFuncWithErrOrRes
): void => {    
    const startHrTime = process.hrtime();

    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs =
        elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    const res = JSON.parse(payload)
        
    let logMessage = `[${new Date().toISOString()}] ${request.method} ${request.originalUrl
        } ${res?.code} ${elapsedTimeInMs.toFixed(3)}ms`;

    logMessage = res?.message ? logMessage + ' | ' + res?.message : logMessage;

    if (res?.code >= 200 && res?.code < 300) {
        /**
         * Logging success response
         */
        Logger.Success(logMessage);
    } else if (res?.code >= 400 && res?.code < 500) {
        /**
         * Logging error validation
         */
        Logger.Warn(logMessage);
    } else if (res?.code >= 500) {
        /**
         * Logging internal server error
         */
        Logger.Error(logMessage);
    }

    done()

};

export default FinishedHook;