import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";
import { Logger } from "../logger.config";

const RequestHook = (
    request: FastifyRequest,
    reply: FastifyReply,
    done: DoneFuncWithErrOrRes
): void => {

    Logger.Info(
        `[REQUEST]: ${JSON.stringify({
            url: request.originalUrl,
            host: request.headers.host,
            data: request.body,
            "content-length": request.headers["content-length"],
            "content-type": request.headers["content-type"],
            "user-agent": request.headers["user-agent"],
        })}`
    );

    done();
};

export default RequestHook;