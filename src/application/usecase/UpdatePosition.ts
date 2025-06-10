import Position from "../../domain/Position";
import { inject } from "../../infra/dependency-injection/Registry";
import PositionRepository from "../../infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../infra/repository/RideRepository"

export default class UpdatePosition {
    @inject("rideRepository")
    rideRepository!: RideRepositoryDatabase;

    @inject("positionRepository")
    positionRepository!: PositionRepository;

    async execute(input: Input) {
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.updatePosition(input.lat, input.long);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number,
}