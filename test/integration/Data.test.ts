import Account from "../../src/domain/Account";
import Ride from "../../src/domain/Ride";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/dependency-injection/Registry";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let databaseConnection: DatabaseConnection;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
})

test("Deve salvar uma account", async function () {
    const accountRepository = new AccountRepositoryDatabase();
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "97456321558", "asdQWE123", true, false, "");
    await accountRepository.saveAccount(account);
    const accountByEmail = await accountRepository.getAccountByEmail(account.getEmail());
    expect(accountByEmail!.getName()).toBe(account.getName());
    expect(accountByEmail!.getEmail()).toBe(account.getEmail());
    expect(accountByEmail!.getCpf()).toBe(account.getCpf());
    expect(accountByEmail!.getPassword()).toBe(account.getPassword());
    const accountById = await accountRepository.getAccountById(account.getAccountId());
    expect(accountById.getName()).toBe(account.getName());
    expect(accountById.getEmail()).toBe(account.getEmail());
    expect(accountById.getCpf()).toBe(account.getCpf());
    expect(accountById.getPassword()).toBe(account.getPassword());
});

test("Deve salvar uma ride", async function () {
    const accountRepository = new AccountRepositoryDatabase();
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "97456321558", "asdQWE123", true, false, "");
    await accountRepository.saveAccount(account);
    const rideRepository = new RideRepositoryDatabase();
    const ride = Ride.create(
        account.getAccountId(),
        -27.584905257808835,
        -48.545022195325124,
        -27.496887588317275,
        -48.522234807851476,
    )
    await rideRepository.saveRide(ride);
})

afterEach(async () => {
    await databaseConnection.close();
})