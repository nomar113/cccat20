import UUID from "../../src/domain/value-object/UUID";
import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/dependency-injection/Registry";
import ORM, { AccountModel } from "../../src/infra/orm/ORM";

test("Deve persisitir usando um ORM", async function() {
    const connection = new PgPromiseAdapter();
    Registry.getInstance().provide("connection", connection);
    const orm = new ORM();
    const accountId = UUID.create().getValue();
    const accountModel = new AccountModel(accountId, "John Doe", "john.doe@gmail.com", "111.111.111-11", "ABC123abc", true, true, "ABC1234");
    await orm.save(accountModel);
    const persistedAccountModel = await orm.get(AccountModel, "account_id", accountId);
    expect(persistedAccountModel.name).toBe("John Doe");
    expect(persistedAccountModel.email).toBe("john.doe@gmail.com");
    expect(persistedAccountModel.cpf).toBe("111.111.111-11");
    expect(persistedAccountModel.password).toBe("ABC123abc");
    expect(persistedAccountModel.isPassenger).toBe(true);
    expect(persistedAccountModel.isDriver).toBe(true);
    expect(persistedAccountModel.carPlate).toBe("ABC1234");
    await connection.close();
});