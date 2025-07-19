import Position from "../../domain/entity/Position";
import DistanceCalculator from "../../domain/service/DistanceCalculator";
import FareCalculator, { FareCalculatorFactory } from "../../domain/service/FareCalculator";
import { inject } from "../../infra/dependency-injection/Registry";
import PositionRepository from "../../infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../infra/repository/RideRepository";


export default class UpdatePosition {
    @inject("rideRepository")
    rideRepository!: RideRepositoryDatabase;

    @inject("positionRepository")
    positionRepository!: PositionRepository;

    async execute(input: Input) {
        const lastPosition = await this.positionRepository.getLastPositionByRideId(input.rideId);
        const actualPosition = Position.create(input.rideId, input.lat, input.long, input.date);
        await this.positionRepository.savePosition(actualPosition);
        const ride = await this.rideRepository.getRideById(input.rideId);
        if (lastPosition) {
            const distance = DistanceCalculator.calculateFromPositions([lastPosition, actualPosition]);
            const fare = FareCalculatorFactory.create(actualPosition.date).calculate(distance);
            ride.setDistance(ride.getDistance() + distance);
            ride.setFare(ride.getFare() + fare);
            await this.rideRepository.updateRide(ride);
        }
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number,
    date?: Date,
}