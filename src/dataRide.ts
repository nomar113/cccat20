import pgp from "pg-promise";

export default interface RideDAO {
    getRideById(rideId: string): Promise<any>
    getRideByAccountId(accountId: string): Promise<any>
    saveRide(ride: any): Promise<void>
}

export class RideDAODatabase implements RideDAO {
    async getRideById(rideId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [ride] = await connection.query("select * from ccca.ride where ride_id = $1", [rideId]);
        await connection.$pool.end();
        return ride;
    }

    async getRideByAccountId(accountId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [ride] = await connection.query("select * from ccca.ride where passenger_id = $1 and status != 'completed'", [accountId]);
        await connection.$pool.end();
        return ride;
    }

    async saveRide(ride: any): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, to_timestamp($11 / 1000.0))", 
            [ride.rideId, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.distance, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
        await connection.$pool.end();
    }
}
