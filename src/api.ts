import express from "express";
import { getAccount } from "./getAccount";
import { signup } from "./signup";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    const input = req.body;
    try {
        const output = await signup(input);
        res.json(output);
    } catch (e: any) {
        return res.status(422).json({ message: e.message });
    }
});

app.get("/accounts/:accountId", async function (req, res) {
    const accountId = req.params.accountId;
    const output = await getAccount(accountId)
    res.json(output);
});

app.listen(3000);
