import AccountRepository from "../../infra/repository/AccountRepository";
import { inject } from "../../infra/dependency-injection/Registry";
import Account from "../../domain/Account";

export default class Signup {
	@inject("accountRepository")
	accountRepository!: AccountRepository;

	async execute(input: any) {
		const account = Account.create(input.name, input.email, input.cpf, input.password, input.isPassenger, input.isDriver, input.carPlate);
		const existingAccount = await this.accountRepository.getAccountByEmail(account.getEmail());
		if (existingAccount) throw new Error("Account already exists");
		await this.accountRepository.saveAccount(account);
		return {
			accountId: account.getAccountId(),
		}
	}
}
