import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../dependency-injection/Registry";

export default class ORM {
    @inject("connection")
    connection!: DatabaseConnection;

    async save (model: Model) {
        const columns = model.columns.map(column => column.column).join(",");
        const params = model.columns.map((_, index) => `$${index + 1}`).join(",");
        const values = model.columns.map(column => model[column.property]);
        const query = `insert into ${model.schema}.${model.table} (${columns}) values (${params})`;
        await this.connection.query(query, values);
    }

    async get (model: any, field: string, value: any) {
        const query = `select * from ${model.prototype.schema}.${model.prototype.table} where ${field} = $1`;
        const [data] = await this.connection.query(query, [value]);
        const object = new model();
        for (const column of model.prototype.columns) {
            object[column.property] = data[column.column];
        }
        return object;
    }
}

export class Model {
    schema!: string;
    table!: string;
    columns!: { column: string, property: string }[];
    [property: string]: any;
}

@model("ccca", "account")
export class AccountModel extends Model{
    @column("account_id")
    accountId!: string;
    @column("name")
    name!: string;
    @column("email")
    email!: string;
    @column("cpf")
    cpf!: string;
    @column("password")
    password!: string;
    @column("is_passenger")
    isPassenger!: boolean;
    @column("is_driver")
    isDriver!: boolean;
    @column("car_plate")
    carPlate!: string;

    constructor(accountId: string, name: string, email: string, cpf: string, password: string, isPassenger: boolean, isDriver: boolean, carPlate: string) {
        super();
        this.accountId = accountId;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
        this.isPassenger = isPassenger;
        this.isDriver = isDriver;
        this.carPlate = carPlate;
    }
}

export function model (schema: string, table: string) {
    return function (target: any) {
        target.prototype.schema = schema;
        target.prototype.table = table;
    }
}

export function column (column: string) {
    return function (target: any, propertyKey: string) {
        target.columns = target.columns || [];
        target.columns.push({ column, property: propertyKey });
    }
}