import Password from "../../src/domain/value-object/Password";

test.each([
    "asdFGH123",
    "asdG123456",
    "aG1aG29090909",
])("Deve validar a senha %s", function (password: string) {
    expect(new Password(password)).toBeDefined();
});

test.each([
    "",
    undefined,
    null,
    "asdfghjkl",
    "ASDFGHJKL",
    "pass123456",
])("Não deve validar a senha %s", function (password: any) {
    expect(() => new Password(password)).toThrow("Invalid password");
});
