import AccountRepository from "./AccountRepository";
import { inject } from "./Registry";
import Account from "./Account";

export default class Signup {
	@inject("accountRepository")
	accountRepository!: AccountRepository;

	async execute(input: any) {
		const account = Account.create(input.name, input.email, input.cpf, input.password, input.isPassenger, input.isDriver, input.carPlate);
		const existingAccount = await this.accountRepository.getAccountByEmail(account.email);
		if (existingAccount) throw new Error("Account already exists");
		await this.accountRepository.saveAccount(account);
		return {
			accountId: account.accountId,
		}
	}
}
