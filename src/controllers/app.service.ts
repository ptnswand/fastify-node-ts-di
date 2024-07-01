import { inject } from "tsyringe";
import { Service } from "../configs/decorators/app-registry.decorator";
import { Account } from "../entities/account.entity";
import { Repository } from "typeorm";
import { HttpError } from "../configs/error.config";

@Service([Account])
export class AppService {
    constructor(
        @inject('AccountRepository')
        private accountRepo: Repository<Account>
    ) { }

    async find() {
        const result = await this.accountRepo.find()
        if (result.length === 0) {
            throw HttpError.NotFound()
        }
        return result
    }
}