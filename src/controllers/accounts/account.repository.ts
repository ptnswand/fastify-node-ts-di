import { Repository } from "typeorm";
import { CustomRepository } from "../../configs/decorators/app-registry.decorator";
import { Account } from "../../entities/account.entity";

@CustomRepository(Account)
export class AccountRepository extends Repository<Account> {
    findByName(name: string) {
        return this.createQueryBuilder('account')
            .where('name = :name', { name })
            .getMany()
    }
}
