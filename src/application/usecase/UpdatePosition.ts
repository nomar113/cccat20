import Position from "../../domain/Position";
import DistanceCalculator from "../../domain/service/DistanceCalculator";
import FareCalculator from "../../domain/service/FareCalculator";
import { inject } from "../../infra/dependency-injection/Registry";
import PositionRepository from "../../infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../infra/repository/RideRepository"

export default class UpdatePosition {
    @inject("rideRepository")
    rideRepository!: RideRepositoryDatabase;

    @inject("positionRepository")
    positionRepository!: PositionRepository;

    async execute(input: Input) {
        const position = Position.create(input.rideId, input.lat, input.long);
        await this.positionRepository.savePosition(position);
        const positions = await this.positionRepository.getPositionsByRideId(input.rideId);
        const distance = DistanceCalculator.calculateFromPositions(positions);
        const fare = FareCalculator.calculate(distance);
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.setDistance(distance);
        ride.setFare(fare);
        await this.rideRepository.updateRide(ride);
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number,
}