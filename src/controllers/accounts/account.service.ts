import { InjectRepository, Service } from "../../configs/decorators/app-registry.decorator";
import { AccountRepository } from "./account.repository";

@Service()
export class AccountService {

    constructor(
        @InjectRepository(AccountRepository)
        private accountRepo: AccountRepository,
    ) { }

    findByName(name: string) {
        return this.accountRepo.findByName(name)
    }
}