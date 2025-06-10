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
        const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(input.driverId);
        if (hasActiveRide) throw new Error("Driver already in a ride");
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.accept(input.driverId);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    driverId: string
}