import { FastifyRequest } from "fastify";
import { Controller } from "../../configs/decorators/app-registry.decorator";
import { Get } from "../../configs/decorators/http-request.decorator";
import { AccountService } from "./account.service";

@Controller('Accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}
    
    @Get('/')
    getAccount(req: FastifyRequest) {
        const { name } = req.query as any
        return this.accountService.findByName(name || '')
    }
}