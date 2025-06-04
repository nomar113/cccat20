import { AccountRepositoryDatabase } from "../src/AccountRepository";
import { RideRepositoryDatabase } from "../src/RideRepository";
import Registry from "../src/Registry";
import { RequestRide } from "../src/RequestRide";
import Signup from "../src/Signup"
import GetRide from "../src/GetRide";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(()=> {
    const accountRepository = new AccountRepositoryDatabase();
    Registry.getInstance().provide("accountRepository", accountRepository);
    signup = new Signup();
    const rideRepository = new RideRepositoryDatabase();
    Registry.getInstance().provide("rideRepository", rideRepository);
    requestRide = new RequestRide();
    getRide = new GetRide();
})

test("Não deve solicitar uma corrida o usuário não seja passageiro", async function() {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isDriver: true,
        carPlate: "ABC1234" 
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476
        }
    }
    await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("The requester must be a passenger"));
})

test("Não deve solicitar uma corrida se a latitude for inválida", async function() {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        from: {
            lat: -91,
            long: -48.545022195325124
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476
        }
    }
    await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("The latitude is invalid"));
})

test("Não deve duplicar uma corrida", async function() {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
    }
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476
        }
    }
    await requestRide.execute(inputRequestRide);
    await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("The requester already have an active ride"));
    
})

test("Deve solicitar uma corrida", async function() {
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
    }
    const outputSignup = await signup.execute(inputSignup);
    expect(outputSignup.accountId).toBeDefined();
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        from: {
            lat: -27.584905257808835,
            long: -48.545022195325124
        },
        to: {
            lat: -27.496887588317275,
            long: -48.522234807851476
        }
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.from.lat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.from.long);
    expect(outputGetRide.toLat).toBe(inputRequestRide.to.lat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.to.long);
    expect(outputGetRide.fare).toBe(21);
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.status).toBe("requested");
})