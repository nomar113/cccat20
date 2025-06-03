import AccountDAO from "./dataAccount";
import RideDAO from "./dataRide";
import { inject } from "./Registry";

export class RequestRide {
    @inject("accountDAO")
    accountDAO!: AccountDAO;
    @inject("rideDAO")
    rideDAO!: RideDAO;

    async execute(input: any) {
        const rideId = crypto.randomUUID();
        const requestRide = {
            rideId: rideId,
            passengerId: input.passengerId,
            driverId: null,
            status: "requested",
            fare: 1,
            distance: 10,
            fromLat: input.from.lat,
            fromLong: input.from.long,
            toLat: input.to.lat,
            toLong: input.to.long,
            date: Date.now(),
        }
        const account = await this.accountDAO.getAccountById(requestRide.passengerId);
        if (!account.is_passenger) throw new Error("Account is not a passenger");
        const existingRide = await this.rideDAO.getRideByAccountId(requestRide.passengerId);
        if (existingRide) throw new Error("Already exists ride for this user")
        await this.rideDAO.saveRide(requestRide);
        return {
            rideId: rideId,
        }
    }
}