import pgp from "pg-promise";

export default interface DatabaseConnection {
    query(statement: string, params: any): Promise<any>;
    close(): Promise<any>;
}

export class PgPromiseAdapter implements DatabaseConnection {
    connnection: any;

    constructor() {
        this.connnection = pgp()("postgres://postgres:123456@localhost:5432/app");
    }

    query(statement: string, params: any): Promise<any> {
        return this.connnection.query(statement, params);
    }

    close(): Promise<any> {
        return this.connnection.$pool.end();
    }
}