import { inject } from "./Registry";
import RideDAO from "./RideDAO";

export default class GetRide {
    @inject("rideDAO")
    rideDAO!: RideDAO

    async execute(rideId:string): Promise<Output> {
        const rideData = await this.rideDAO.getRideById(rideId);
        return {
            rideId: rideData.ride_id,
            passengerId: rideData.passenger_id,
            from: {
                lat: parseFloat(rideData.from_lat),
                long: parseFloat(rideData.from_long),
            },
            to: {
                lat: parseFloat(rideData.to_lat),
                long: parseFloat(rideData.to_long),
            },
            distance: parseFloat(rideData.distance),
            fare: parseFloat(rideData.fare),
            status: rideData.status,
            date: rideData.date,
        };
    } 
}

type Output = {
    rideId: string,
    passengerId: string,
    from: Coord,
    to: Coord,
    fare: number
    distance: number,
    status: string,
    date: Date,
}

type Coord = {
    lat: number,
    long: number,
}