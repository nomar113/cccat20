import pgp from "pg-promise";

export async function getAccountByEmail(email: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [account] = await connection.query("select * from ccca.account where email = $1", [email]);
    await connection.$pool.end();
    return account;
}

export async function getAccountById(accountId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [output] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
    await connection.$pool.end();
    return output;
}

export async function saveAccount(account: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]);
    await connection.$pool.end();
}
