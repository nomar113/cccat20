import Position from "../../domain/entity/Position";
import { inject } from "../../infra/dependency-injection/Registry";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetRide {
    @inject("rideRepository")
    rideRepository!: RideRepository
    @inject("positionRepository")
    positionRepository!: PositionRepository

    async execute(rideId:string): Promise<Output> {
        const ride = await this.rideRepository.getRideById(rideId);
        const positions = await this.positionRepository.getPositionsByRideId(rideId);
        return {
            rideId: ride.getRideId(),
            passengerId: ride.getPassengerId(),
            driverId: ride.getDriverId() ? ride.getDriverId() : undefined,
            fromLat: ride.getFrom().getLat(),
            fromLong: ride.getFrom().getLong(),
            toLat: ride.getTo().getLat(),
            toLong: ride.getTo().getLong(),
            fare: ride.getFare(),
            distance: ride.getDistance(),
            status: ride.getStatus(),
            date: ride.date,
            positions: positions.map((position: Position) => ({ lat: position.getCoord().getLat(), long: position.getCoord().getLong() })),
        }
    } 
}

type Output = {
    rideId: string,
    passengerId: string,
    driverId?: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number, 
    fare: number
    distance: number,
    status: string,
    date: Date,
    positions: { lat: number, long: number }[],
}
