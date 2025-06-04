import crypto from "crypto";
import { AccountRepositoryDatabase } from "../src/AccountRepository";
import { RideRepositoryDatabase } from "../src/RideRepository";
import Account from "../src/Account";
import Ride from "../src/Ride";
import DatabaseConnection, { PgPromiseAdapter } from "../src/DatabaseConnection";
import Registry from "../src/Registry";

let databaseConnection: DatabaseConnection;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
})

test("Deve salvar uma account", async function () {
    const accountRepository = new AccountRepositoryDatabase();
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "97456321558", "asdQWE123", true, false, "");
    await accountRepository.saveAccount(account);
    const accountByEmail = await accountRepository.getAccountByEmail(account.email);
    expect(accountByEmail!.name).toBe(account.name);
    expect(accountByEmail!.email).toBe(account.email);
    expect(accountByEmail!.cpf).toBe(account.cpf);
    expect(accountByEmail!.password).toBe(account.password);
    const accountById = await accountRepository.getAccountById(account.accountId);
    expect(accountById.name).toBe(account.name);
    expect(accountById.email).toBe(account.email);
    expect(accountById.cpf).toBe(account.cpf);
    expect(accountById.password).toBe(account.password);
});

test("Deve salvar uma ride", async function () {
    const accountRepository = new AccountRepositoryDatabase();
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "97456321558", "asdQWE123", true, false, "");
    await accountRepository.saveAccount(account);
    const rideRepository = new RideRepositoryDatabase();
    const ride = Ride.create(
        account.accountId,
        {
            lat: -27.584905257808835,
            long: -48.545022195325124
        },
        {
            lat: -27.496887588317275,
            long: -48.522234807851476
        });
    await rideRepository.saveRide(ride);
})

afterEach(async () => {
    await databaseConnection.close();
})