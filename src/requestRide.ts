import AccountDAO from "./dataAccount";
import RideDAO from "./RideDAO";
import { inject } from "./Registry";

export class RequestRide {
    @inject("accountDAO")
    accountDAO!: AccountDAO;
    @inject("rideDAO")
    rideDAO!: RideDAO;

    async execute(input: Input): Promise<Output> {
        const account = await this.accountDAO.getAccountById(input.passengerId);
        if (!account.is_passenger) throw new Error("The requester must be a passenger");
        const hasActiveRide = await this.rideDAO.hasActiveRideByPassengerId(input.passengerId);
        if (hasActiveRide) throw new Error("The requester already have an active ride")
        if (input.from.lat < -90 || input.from.lat > 90) throw new Error("The latitude is invalid")
        if (input.to.lat < -90 || input.to.lat > 90) throw new Error("The latitude is invalid")
        if (input.from.lat < -180 || input.from.lat > 180) throw new Error("The longitude is invalid")
        if (input.to.lat < -180 || input.to.lat > 180) throw new Error("The longitude is invalid")
        const rideId = crypto.randomUUID();
        const requestRide = {
            rideId: rideId,
            passengerId: input.passengerId,
            driverId: null,
            status: "requested",
            fare: 0,
            distance: 0,
            fromLat: input.from.lat,
            fromLong: input.from.long,
            toLat: input.to.lat,
            toLong: input.to.long,
            date: Date.now(),
        }
        await this.rideDAO.saveRide(requestRide);
        return {
            rideId: rideId,
        }
    }
}

type Input = {
    passengerId: string,
    from: Coord,
    to: Coord
}

type Coord = {
    lat: number,
    long: number
}

type Output = {
    rideId: string;
}