import CarPlate from "../value-object/CarPlate";
import Cpf from "../value-object/Cpf";
import Email from "../value-object/Email";
import Name from "../value-object/Name";
import Password from "../value-object/Password";
import UUID from "../value-object/UUID";

// Clean Architecture: Entity
// TDD: Entity (porque tem identidade e pode sofrer mutação de estado)
// TDD: Aggregate: composto por Entity Account e os Value Objects (UUID, Name, Email, Cpf, Password, CarPlate)
// TDD: todo aggregate tem um Aggregate Root <AR>, e é a Entity que "lidera" o aggregate
export default class Account {
    // TDD: Value Object
    private accountId: UUID;
    // TDD: Value Object
    private name: Name;
    // TDD: Value Object
    private email: Email;
    // TDD: Value Object
    private cpf: Cpf;
    // TDD: Value Object
    private password: Password;
    // TDD: Value Object
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

    // static factory method
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