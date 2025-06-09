import CarPlate from "./value-object/CarPlate";
import Cpf from "./value-object/Cpf";
import Email from "./value-object/Email";
import Name from "./value-object/Name";
import Password from "./value-object/Password";
import UUID from "./value-object/UUID";

// Clean Architecture: Entity
export default class Account {
    private accountId: UUID;
    private name: Name;
    private email: Email;
    private cpf: Cpf;
    private password: Password;
    private carPlate?: CarPlate;

    constructor(
        accountId: string,
        name: string,
        email: string,
        cpf: string,
        password: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
        carPlate: string,
    ) {
        this.accountId = new UUID(accountId);
        this.name = new Name(name);
        this.email = new Email(email);
        this.password = new Password(password);
		this.cpf = new Cpf(cpf);
		if (isDriver) this.carPlate = new CarPlate(carPlate);
    }

    // staitc factory method
    static create(
        name: string,
        email: string,
        cpf: string,
        password: string,
        isPassenger: boolean,
        isDriver: boolean,
        carPlate: string,
    ) {
        const accountId = UUID.create().getValue();
        return new Account(accountId, name, email, cpf, password, isPassenger, isDriver, carPlate);
    }

    getAccountId() {
        return this.accountId.getValue();
    }

    getName() {
        return this.name.getValue();
    }

    setName(name: string) {
        this.name = new Name(name);
    }

    getEmail() {
        return this.email.getValue();
    }

    getCpf() {
        return this.cpf.getValue();
    }

    getPassword() {
        return this.password.getValue();
    }

    getCarPlate() {
        return this.carPlate?.getValue();
    }
}