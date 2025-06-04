import pgp from "pg-promise";
import Ride from "./Ride";
import { inject } from "./Registry";
import DatabaseConnection from "./DatabaseConnection";

// Clean Architecture: Interface Adapter
export default interface RideRepository {
    getRideById(rideId: string): Promise<Ride>
    hasActiveRideByPassengerId(accountId: string): Promise<boolean>
    saveRide(ride: Ride): Promise<void>
}

export class RideRepositoryDatabase implements RideRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async getRideById(rideId: string): Promise<Ride> {
        const [data] = await this.connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        return new Ride(data.ride_id, data. passenger_id, data.driver_id, parseFloat(data.from_lat), parseFloat(data.from_long), parseFloat(data.to_lat), parseFloat(data.to_long), data.fare, data.distance, data.status, data.date);
    }

    async hasActiveRideByPassengerId(accountId: string): Promise<boolean> {
        const [data] = await this.connection.query("select 1 from ccca.ride where passenger_id = $1 and status != 'completed'", [accountId]);
        return !!data;
    }

    async saveRide(ride: Ride): Promise<void> {
        
        await this.connection.query("insert into ccca.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
            [ride.rideId, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
        
    }
}
