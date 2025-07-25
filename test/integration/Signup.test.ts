import sinon from "sinon";
import GetAccount from "../../src/application/usecase/GetAccount";
import Signup from "../../src/application/usecase/Signup";
import Account from "../../src/domain/entity/Account";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/dependency-injection/Registry";
import ORM from "../../src/infra/orm/ORM";
import { AccountRepositoryMemory, AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";

let databaseConnection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    const useInMemory = false;
    const useORM = true;
    databaseConnection = new PgPromiseAdapter();
    const accountRepository = useInMemory ? new AccountRepositoryMemory() : new AccountRepositoryDatabase();
    const orm = new ORM();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    Registry.getInstance().provide("accountRepository", accountRepository);
    Registry.getInstance().provide("orm", orm);
    signup = new Signup();
    getAccount = new GetAccount();
})

test("Deve fazer a criação da conta de um usuário do tipo passageiro", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Deve fazer a criação da conta de um usuário do tipo motorista", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isDriver: true,
        carPlate: "ABC1234"
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    expect(outputGetAccount.isDriver).toBe(input.isDriver);
    expect(outputGetAccount.carPlate).toBe(input.carPlate);
});

test("Não deve fazer a criação da conta do usuário com nome inválido", async function () {
    const input = {
        name: "John ",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
})

test("Não deve fazer a criação da conta do usuário com email inválido", async function() {
     const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"))
})

test("Não deve fazer a criação da conta do usuário com cpf inválido", async function() {
     const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "974563215",
        password: "asdQWE123",
        isPassenger: true
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
})

test("Não deve fazer a criação da conta do usuário com senha inválido", async function() {
     const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE",
        isPassenger: true
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid password"));
})

test("Não deve fazer a criação da conta do usuário se a conta estiver duplicada", async function() {
     const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    await signup.execute(input)
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
})

test("Não deve fazer a criação da conta do usuário se a placa for inválida", async function() {
     const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isDriver: true,
        carPlate: "AAA123"
    }
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
})

// Test Patterns
test("Deve fazer a criação da conta de um usuário do tipo passageiro com stub", async function () {
    const input: any = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
    };
    const saveAccountStub = sinon.stub(AccountRepositoryDatabase.prototype, "saveAccount").resolves();
    const getAccountByEmailStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountByEmail").resolves();
    const getAccountByIdStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountById").resolves(Account.create(input.name, input.email, input.cpf, input.password, input.isPassenger, input.isDriver, input.carPlate));
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    saveAccountStub.restore();
    getAccountByEmailStub.restore();
    getAccountByIdStub.restore();
});

test("Deve fazer a criação da conta de um usuário do tipo passageiro com spy", async function () {
    const saveAccountSpy = sinon.spy(AccountRepositoryDatabase.prototype, "saveAccount")
    const getAccountByIdSpy = sinon.spy(AccountRepositoryDatabase.prototype, "getAccountById")
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    expect(saveAccountSpy.calledOnce).toBe(true);
    expect(getAccountByIdSpy.calledWith(outputSignup.accountId)).toBe(true);
    saveAccountSpy.restore();
    getAccountByIdSpy.restore();
});

test("Deve fazer a criação da conta de um usuário do tipo passageiro com mock", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
        isDriver: false,
        carPlate: "",
    };
    const accountRepositoryMock = sinon.mock(AccountRepositoryDatabase.prototype);
    accountRepositoryMock.expects("saveAccount").once().resolves();
    accountRepositoryMock.expects("getAccountByEmail").once().resolves();
    const outputSignup = await signup.execute(input);
    accountRepositoryMock.expects("getAccountById").once().withArgs(outputSignup.accountId).resolves(Account.create(input.name, input.email, input.cpf, input.password, input.isPassenger, input.isDriver, input.carPlate));
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    accountRepositoryMock.verify();
    accountRepositoryMock.restore();
});

test("Deve fazer a criação da conta de um usuário do tipo passageiro com fake", async function () {
    const accountRepository = new AccountRepositoryMemory();
    signup = new Signup();
    getAccount = new GetAccount();
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
});

afterEach(async () => {
    await databaseConnection.close();
})