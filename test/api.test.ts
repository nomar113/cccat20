import axios from "axios"

axios.defaults.validateStatus = function() {
    return true;
}

test("Deve fazer a criação da conta de um usuário do tipo motorista", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isDriver: true,
        carPlate: "ABC1234"
    };
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`)
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.password).toBe(input.password);
    expect(outputGetAccount.is_driver).toBe(input.isDriver);
});

test("Não deve fazer a criação da conta do usuário se a conta estiver duplicada", async function() {
     const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true
    }
    await axios.post("http://localhost:3000/signup", input);
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    expect(responseSignup.status).toBe(422);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Account already exists")
})

test("Deve fazer a solicitação de uma corrida", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
    };
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
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
    const responseRequestRide = await axios.post("http://localhost:3000/request-ride", inputRequestRide);
    const outputRequestRide = responseRequestRide.data;
    expect(outputRequestRide.rideId).toBeDefined();
    const responseRide = await axios.get(`http://localhost:3000/ride/${outputRequestRide.rideId}`);
    const outputRide = responseRide.data;
    expect(outputRide.passengerId).toBe(outputSignup.accountId);
    expect(outputRide.from.lat).toBe(inputRequestRide.from.lat);
    expect(outputRide.from.long).toBe(inputRequestRide.from.long);
    expect(outputRide.to.lat).toBe(inputRequestRide.to.lat);
    expect(outputRide.to.long).toBe(inputRequestRide.to.long);
    expect(outputRide.status).toBe("requested");
});

test("Não deve duplicar a solicitação de uma corrida", async function () {
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        password: "asdQWE123",
        isPassenger: true,
    };
    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;
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
    await axios.post("http://localhost:3000/request-ride", inputRequestRide);
    const responseRequestRide = await axios.post("http://localhost:3000/request-ride", inputRequestRide);
    expect(responseRequestRide.status).toBe(422);
    const outputRequestRide = responseRequestRide.data;
    expect(outputRequestRide.message).toBe("The requester already have an active ride");
});