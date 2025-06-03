import express from "express";
import { AccountDAODatabase } from "./dataAccount";
import Signup from "./signup";
import GetAccount from "./getAccount";
import { RequestRide } from "./requestRide";
import { RideDAODatabase } from "./dataRide";
import GetRide from "./getRide";

const app = express();
app.use(express.json());

const accountDAO = new AccountDAODatabase();
const signup = new Signup(accountDAO);
const getAccount = new GetAccount(accountDAO);
const rideDAO = new RideDAODatabase();
const requestRide = new RequestRide(accountDAO, rideDAO);
const getRide = new GetRide(rideDAO);

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
