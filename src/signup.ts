import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import { getAccountByEmail, saveAccount } from "./data";

export async function signup(input: any) {
	const account = {
		accountId: crypto.randomUUID(),
		name: input.name,
		email: input.email,
		cpf: input.cpf,
		password: input.password,
		carPlate: input.carPlate,
		isPassenger: input.isPassenger,
		isDriver: input.isDriver
	}
	const existingAccount = await getAccountByEmail(account.email);
	if (existingAccount) throw new Error("Account already exists");
	if (!account.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
	if (!account.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
	if (!account.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)) throw new Error("Invalid password");
	if (!validateCpf(account.cpf)) throw new Error("Invalid cpf");
	if (account.isDriver && !account.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate");
	await saveAccount(account);
	return {
		accountId: account.accountId
	};
}
