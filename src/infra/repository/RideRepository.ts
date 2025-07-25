import Ride from "../../domain/entity/Ride";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../dependency-injection/Registry";

// Clean Architecture: Interface Adapter
export default interface RideRepository {
    getRideById(rideId: string): Promise<Ride>;
    saveRide(ride: Ride): Promise<void>;
    updateRide(ride: Ride): Promise<void>;
    hasActiveRideByPassengerId(accountId: string): Promise<boolean>;
    hasActiveRideByDriverId(accountId: string): Promise<boolean>;
}

export class RideRepositoryDatabase implements RideRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async getRideById(rideId: string): Promise<Ride> {
        const [data] = await this.connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        return new Ride(data.ride_id, data. passenger_id, data.driver_id, parseFloat(data.from_lat), parseFloat(data.from_long), parseFloat(data.to_lat), parseFloat(data.to_long), parseFloat(data.fare), parseFloat(data.distance), data.status, data.date);
    }

    async saveRide(ride: Ride): Promise<void> {
        await this.connection.query("insert into ccca.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
            [ride.getRideId(), ride.getPassengerId(), ride.getDriverId(), ride.getStatus(), ride.getFare(), ride.getDistance(), ride.getFrom().getLat(), ride.getFrom().getLong(), ride.getTo().getLat(), ride.getTo().getLong(), ride.date]);   
    }

    async updateRide(ride: Ride): Promise<void> {
        await this.connection.query("update ccca.ride set driver_id = $1, status = $2, fare = $3, distance = $4 where ride_id = $5", [ride.getDriverId(), ride.getStatus(), ride.getFare(), ride.getDistance(), ride.getRideId()]);
    }

    async hasActiveRideByPassengerId(accountId: string): Promise<boolean> {
        const [data] = await this.connection.query("select 1 from ccca.ride where passenger_id = $1 and status != 'completed'", [accountId]);
        return !!data;
    }

    async hasActiveRideByDriverId(accountId: string): Promise<boolean> {
        const [data] = await this.connection.query("select 1 from ccca.ride where driver_id = $1 and (status = 'accepted' or status = 'in_progress')", [accountId]);
        return !!data;
    }
}
