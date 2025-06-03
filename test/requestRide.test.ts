import { AccountDAODatabase } from "../src/dataAccount";
import { RideDAODatabase } from "../src/dataRide";
import { RequestRide } from "../src/requestRide";
import Signup from "../src/signup"

let signup: Signup;
let requestRide: RequestRide;

beforeEach(()=> {
    const accountDAO = new AccountDAODatabase();
    signup = new Signup(accountDAO);
    const rideDAO = new RideDAODatabase();
    requestRide = new RequestRide(accountDAO, rideDAO);
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
            lat: -22.88607,
            long: -43.28329
        },
        to: {
            lat: -22.912376,
            long: -43.230320
        }
    }
    await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account is not a passenger"));
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
            lat: -22.88607,
            long: -43.28329
        },
        to: {
            lat: -22.912376,
            long: -43.230320
        }
    }
    await requestRide.execute(inputRequestRide);
    await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Already exists ride for this user"));
    
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
            lat: -22.88607,
            long: -43.28329
        },
        to: {
            lat: -22.912376,
            long: -43.230320
        }
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
})