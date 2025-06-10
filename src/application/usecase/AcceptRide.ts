import { inject } from "../../infra/dependency-injection/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";
import GetRide from "./GetRide";

export default class AcceptRide {
    @inject("accountRepository")
    accountRepository!: AccountRepository;

    @inject("getRide")
    getRide!: GetRide;

    @inject("rideRepository")
    rideRepository!: RideRepository;

    async execute(input: Input) {
        const account = await this.accountRepository.getAccountById(input.driverId);
        if (!account.isDriver) throw new Error("Account must be a driver");
        const ride = await this.getRide.execute(input.rideId);
        if (ride.status !== "requested") throw new Error("Ride must be requested");
        const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(input.driverId);
        if (hasActiveRide) throw new Error("Driver already in a ride");
        await this.rideRepository.acceptRide(input.rideId, input.driverId);
    }
}

type Input = {
    rideId: string,
    driverId: string
}