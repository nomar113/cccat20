import { inject } from "../../infra/dependency-injection/Registry";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetRide {
    @inject("rideRepository")
    rideRepository!: RideRepository

    async execute(rideId:string): Promise<Output> {
        const ride = await this.rideRepository.getRideById(rideId);        
        return {
            rideId: ride.getRideId(),
            passengerId: ride.getPassengerId(),
            driverId: ride.getDriverId() ? ride.getDriverId() : undefined,
            fromLat: ride.getFrom().getLat(),
            fromLong: ride.getFrom().getLong(),
            toLat: ride.getTo().getLat(),
            toLong: ride.getTo().getLong(),
            fare: ride.calculateFare(),
            distance: ride.calculateDistance(),
            status: ride.status,
            date: ride.date,
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
}
