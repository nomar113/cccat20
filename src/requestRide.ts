import AccountRepository from "./AccountRepository";
import RideRepository from "./RideRepository";
import { inject } from "./Registry";
import Ride from "./Ride";

export class RequestRide {
    @inject("accountRepository")
    accountRepository!: AccountRepository;
    @inject("rideRepository")
    rideRepository!: RideRepository;

    async execute(input: Input): Promise<Output> {
        const account = await this.accountRepository.getAccountById(input.passengerId);
        if (!account.isPassenger) throw new Error("The requester must be a passenger");
        const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
        if (hasActiveRide) throw new Error("The requester already have an active ride")
        const ride = Ride.create(input.passengerId, input.from, input.to);
        await this.rideRepository.saveRide(ride);
        return {
            rideId: ride.rideId,
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