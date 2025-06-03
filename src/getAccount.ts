import AccountDAO from "./dataAccount";
import { inject } from "./Registry";

export default class GetAccount {
    @inject("accountDAO")
    accountDAO!: AccountDAO

    async execute(accountId: string) {
        const output = await this.accountDAO.getAccountById(accountId);
        return output;
    }
}
