import Account from "../../src/domain/Account"

test("Deve criar uma conta passageiro", function () {
    const account = Account.create(
        "John Doe",
        `john.doe${Math.random()}@gmail.com`,
        "97456321558",
        "asdQWE123",
        true,
        false,
        "");
    expect(account).toBeDefined();
});

test("Deve criar uma conta motorista", function () {
    const account = Account.create(
        "John Doe",
        `john.doe${Math.random()}@gmail.com`,
        "97456321558",
        "asdQWE123",
        false,
        true,
        "AAA1111"
    );
    expect(account).toBeDefined();
});

test("Não deve criar uma conta passageiro com account id inválido", function () {
    expect(() => new Account(
        "1",
        "John Doe",
        `john.doe${Math.random()}@gmail.com`,
        "97456321558",
        "asdQWE123",
        false,
        true,
        "AAA111"
    )).toThrow(new Error("Invalid UUID"));
});

test("Não deve criar uma conta motorista com placa inválida", function () {
    expect(() => Account.create(
        "John Doe",
        `john.doe${Math.random()}@gmail.com`,
        "97456321558",
        "asdQWE123",
        false,
        true,
        "AAA111"
    )).toThrow(new Error("Invalid car plate"));
});