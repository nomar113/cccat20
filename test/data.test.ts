import crypto from "crypto";
import { AccountDAODatabase } from "../src/dataAccount";
import { RideDAODatabase } from "../src/dataRide";

test("Deve salvar uma account", async function () {
    const accountDAO = new AccountDAODatabase();
    const account = {
        accountId: crypto.randomUUID(),
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    await accountDAO.saveAccount(account);
    const accountByEmail = await accountDAO.getAccountByEmail(account.email);
    expect(accountByEmail.name).toBe(account.name);
    expect(accountByEmail.email).toBe(account.email);
    expect(accountByEmail.cpf).toBe(account.cpf);
    expect(accountByEmail.password).toBe(account.password);
    const accountById = await accountDAO.getAccountById(account.accountId);
    expect(accountById.name).toBe(account.name);
    expect(accountById.email).toBe(account.email);
    expect(accountById.cpf).toBe(account.cpf);
    expect(accountById.password).toBe(account.password);
});

test("Deve salvar uma ride", async function () {
    const accountDAO = new AccountDAODatabase();
    const account = {
        accountId: crypto.randomUUID(),
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    await accountDAO.saveAccount(account);
    const rideDAO = new RideDAODatabase();
    const ride = {
        rideId: crypto.randomUUID(),
        passengerId: account.accountId,
        driverId: null,
        status: "requested",
        fare: 1,
        distance: 10,
        fromLat: 1,
        fromLong: 1,
        toLat: 2,
        toLong: 2,
        date: Date.now(),
    }
    await rideDAO.saveRide(ride);
})