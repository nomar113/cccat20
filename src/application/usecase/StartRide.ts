import { inject } from "../../infra/dependency-injection/Registry";
import { RideRepositoryDatabase } from "../../infra/repository/RideRepository";
import GetRide from "./GetRide";

export default class StartRide {
    @inject("getRide")
    getRide!: GetRide;

    @inject("rideRepository")
    rideRepository!: RideRepositoryDatabase;

    async execute(input: Input) {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.start();
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string;
}