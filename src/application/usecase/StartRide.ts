import { inject } from "../../infra/dependency-injection/Registry";
import { RideRepositoryDatabase } from "../../infra/repository/RideRepository";
import GetRide from "./GetRide";

export default class StartRide {
    @inject("getRide")
    getRide!: GetRide;

    @inject("rideRepository")
    rideRepository!: RideRepositoryDatabase;

    async execute(rideId: string) {
        const ride = await this.getRide.execute(rideId);
        if (ride.status !== "accepted") throw new Error("Ride must be accepted");
        await this.rideRepository.startRide(rideId);
    }
}