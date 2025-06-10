import Position from "../../domain/Position";
import Ride from "../../domain/Ride";
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
        const ride = new Ride(data.ride_id, data. passenger_id, data.driver_id, parseFloat(data.from_lat), parseFloat(data.from_long), parseFloat(data.to_lat), parseFloat(data.to_long), data.fare, data.distance, data.status, data.date);
        const positionsData = await this.connection.query("select * from ccca.position where ride_id = $1", [ride.getRideId()]);
        const positions = [];
        for (const positionData of positionsData) {
            positions.push(new Position(positionData.position_id, positionData.ride_id, parseFloat(positionData.lat), parseFloat(positionData.long)));
        }
        ride.setPositions(positions);
        return ride;
    }

    async saveRide(ride: Ride): Promise<void> {
        await this.connection.query("insert into ccca.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
            [ride.getRideId(), ride.getPassengerId(), ride.getDriverId(), ride.getStatus(), ride.fare, ride.distance, ride.getFrom().getLat(), ride.getFrom().getLong(), ride.getTo().getLat(), ride.getTo().getLong(), ride.date]);   
    }

    async updateRide(ride: Ride): Promise<void> {
        await this.connection.query("update ccca.ride set driver_id = $1, status = $2 where ride_id = $3", [ride.getDriverId(), ride.getStatus(), ride.getRideId()]);
        await this.connection.query("delete from ccca.position where ride_id = $1", [ride.getRideId()]);
        for (const position of ride.getPositions()) {
            await this.connection.query("insert into ccca.position (position_id, ride_id, lat, long) values ($1, $2, $3, $4)", 
                [position.getPositionId(), position.getRideId(), position.getCoord().getLat(), position.getCoord().getLong()])
        }
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
