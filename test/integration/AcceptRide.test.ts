import AcceptRide from "../../src/application/usecase/AcceptRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import Signup from "../../src/application/usecase/Signup";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/dependency-injection/Registry";
import AccountRepository, { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import RideRepository, { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;
let signup: Signup;
let rideRepository: RideRepository;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase();
    rideRepository = new RideRepositoryDatabase();
    signup = new Signup();
    requestRide = new RequestRide();
    acceptRide = new AcceptRide();
    getRide = new GetRide();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    Registry.getInstance().provide("accountRepository", accountRepository);
    Registry.getInstance().provide("rideRepository", rideRepository);
    Registry.getInstance().provide("getRide", getRide);
});

test("Não deve aceitar uma corrida se for um passageiro", async function () {
    const inputPassenger = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
    };
    const outputSignup = await signup.execute(inputPassenger);
    expect(outputSignup).toBeDefined();
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476,
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide).toBeDefined();
    const inputAcceptedRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignup.accountId,
    }
    await expect(() => acceptRide.execute(inputAcceptedRide)).rejects.toThrow(new Error("Account must be a driver"));
});

test("Deve aceitar uma corrida", async function () {
    const inputPassenger = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
    };
    const outputSignupPassenger = await signup.execute(inputPassenger);
    expect(outputSignupPassenger).toBeDefined();
    const inputDriver = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: false,
        isDriver: true,
        carPlate: "ABC1234",
    };
    const outputSignupDriver = await signup.execute(inputDriver);
    expect(outputSignupDriver).toBeDefined();
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476,
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide).toBeDefined();
    const inputAcceptedRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    }
    await acceptRide.execute(inputAcceptedRide);
    const ride = await getRide.execute(outputRequestRide.rideId);
    expect(ride.driverId).toBe(outputSignupDriver.accountId);
});

afterEach(async () => {
    await databaseConnection.close();
});
