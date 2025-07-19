import AcceptRide from "../../src/application/usecase/AcceptRide";
import FinishRide from "../../src/application/usecase/FinishRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import Signup from "../../src/application/usecase/Signup";
import StartRide from "../../src/application/usecase/StartRide";
import UpdatePosition from "../../src/application/usecase/UpdatePosition";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/dependency-injection/Registry";
import AccountRepository, { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import RideRepository, { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;
let rideRepository: RideRepository;
let positionRepository: PositionRepositoryDatabase;
let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;

beforeEach(() => {
    databaseConnection = new PgPromiseAdapter();
    accountRepository = new AccountRepositoryDatabase();
    rideRepository = new RideRepositoryDatabase();
    signup = new Signup();
    requestRide = new RequestRide();
    acceptRide = new AcceptRide();
    getRide = new GetRide();
    startRide = new StartRide();
    positionRepository = new PositionRepositoryDatabase();
    updatePosition = new UpdatePosition();
    finishRide = new FinishRide();
    Registry.getInstance().provide("databaseConnection", databaseConnection);
    Registry.getInstance().provide("accountRepository", accountRepository);
    Registry.getInstance().provide("rideRepository", rideRepository);
    Registry.getInstance().provide("getRide", getRide);
    Registry.getInstance().provide("positionRepository", positionRepository);
});

test("Deve finalizar uma corrida", async function() {
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
    let ride;
    ride = await getRide.execute(outputRequestRide.rideId);
    expect(ride.driverId).toBe(outputSignupDriver.accountId);
    expect(ride.status).toBe("accepted");
    const inputStartRide = {
        rideId: ride.rideId
    }
    await startRide.execute(inputStartRide);

    const inputPosition1 = {
        rideId: ride.rideId,
        lat: -27.584905257808835,
        long: -48.545022195325124,
    }
    await updatePosition.execute(inputPosition1);

    const inputPosition2 = {
        rideId: ride.rideId,
        lat: -27.496887588317275,
        long: -48.522234807851476,
    }
    await updatePosition.execute(inputPosition2);

    const inputPosition3 = {
        rideId: ride.rideId,
        lat: -27.584905257808835,
        long: -48.545022195325124,
    }
    await updatePosition.execute(inputPosition3);
    const inputFinishRide = {
        rideId: outputRequestRide.rideId,
    }
    await finishRide.execute(inputFinishRide);
    ride = await getRide.execute(outputRequestRide.rideId);
    expect(ride.status).toBe("completed");
    expect(ride.distance).toBe(20);
    expect(ride.fare).toBe(42);
});

afterEach(async () => {
    await databaseConnection.close();
});
