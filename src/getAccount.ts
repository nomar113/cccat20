import { getAccountById } from "./data";

export async function getAccount(accountId: string) {
    const output = await getAccountById(accountId);
    return output;
}