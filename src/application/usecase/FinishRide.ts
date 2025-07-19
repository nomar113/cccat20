import Position from "../../domain/Position";
import DistanceCalculator from "../../domain/service/DistanceCalculator";
import FareCalculator from "../../domain/service/FareCalculator";
import { inject } from "../../infra/dependency-injection/Registry";
import PositionRepository from "../../infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../infra/repository/RideRepository"

export default class FinishRide {
    @inject("rideRepository")
    rideRepository!: RideRepositoryDatabase;

    @inject("positionRepository")
    positionRepository!: PositionRepository;

    async execute(input: Input) {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.finish();
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string,
}