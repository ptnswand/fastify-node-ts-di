import { Repository } from "typeorm";
import { InjectEntityRepo, InjectRepository, Service } from "../../configs/decorators/app-registry.decorator";
import { Account } from "../../entities/account.entity";
import { AccountRepository } from "./account.repository";

@Service()
export class AccountService {

    constructor(
        @InjectRepository(AccountRepository)
        private customAccountRepo: AccountRepository,
        @InjectEntityRepo(Account)
        private accountRepo: Repository<Account>
    ) { }

    findByName(name: string) {
        return this.customAccountRepo.findByName(name)
    }

    findAll() {
        return this.accountRepo.find()
    }
}