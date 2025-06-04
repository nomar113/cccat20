import express from "express";
import { AccountRepositoryDatabase } from "./AccountRepository";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import { RequestRide } from "./RequestRide";
import { RideRepositoryDatabase } from "./RideRepository";
import GetRide from "./GetRide";
import Registry from "./Registry";

const app = express();
app.use(express.json());

const accountRepository = new AccountRepositoryDatabase();
Registry.getInstance().provide("accountRepository", accountRepository);
const signup = new Signup();
const getAccount = new GetAccount();
const rideRepository = new RideRepositoryDatabase();
Registry.getInstance().provide("rideRepository", rideRepository);
const requestRide = new RequestRide();
const getRide = new GetRide();

app.post("/signup", async function (req, res) {
    const input = req.body;
    try {
        const output = await signup.execute(input);
        res.json(output);
    } catch (e: any) {
        return res.status(422).json({ message: e.message });
    }
});

app.get("/accounts/:accountId", async function (req, res) {
    const accountId = req.params.accountId;
    const output = await getAccount.execute(accountId)
    res.json(output);
});

app.post("/request-ride", async function (req, res) {
    const input = req.body;
    try {
        const output = await requestRide.execute(input);
        res.json(output);
    } catch(e: any) {
        return res.status(422).json({ message: e.message })
    }
});

app.get("/ride/:rideId", async function (req, res){
    const rideId = req.params.rideId;
    const output = await getRide.execute(rideId);
    res.json(output);
});

app.listen(3000);
