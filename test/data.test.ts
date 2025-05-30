import crypto from "crypto";
import { getAccountByEmail, getAccountById, saveAccount } from "../src/data";

test("Deve salvar uma account", async function () {
    const account = {
        accountId: crypto.randomUUID(),
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    await saveAccount(account);
    const accountByEmail = await getAccountByEmail(account.email);
    expect(accountByEmail.name).toBe(account.name);
    expect(accountByEmail.email).toBe(account.email);
    expect(accountByEmail.cpf).toBe(account.cpf);
    expect(accountByEmail.password).toBe(account.password);
    const accountById = await getAccountById(account.accountId);
    expect(accountById.name).toBe(account.name);
    expect(accountById.email).toBe(account.email);
    expect(accountById.cpf).toBe(account.cpf);
    expect(accountById.password).toBe(account.password);
});