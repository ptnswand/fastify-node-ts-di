import { Controller } from "../../configs/decorators/app-registry.decorator";
import { Get, ValidateReq } from "../../configs/decorators/http-request.decorator";
import { Account } from "../../entities/account.entity";
import { AccountSearchQuery } from "./account.dto";
import { AccountService } from "./account.service";

@Controller('Accounts')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}
    
    @Get('/')
    getAllAccount() {
        return this.accountService.findAll()
    }
    
    @Get('/Search/:SearchID')
    getAccount(
        @ValidateReq(AccountSearchQuery)
        data: AccountSearchQuery,
    ): Promise<Account[]> {
        // const { name } = req.query as any
        console.log('constroller', data)
        return this.accountService.findByName('')
    }
}