import crypto from "crypto";

export default class Ride {

    constructor(
        readonly rideId: string,
        readonly passengerId: string,
        readonly driverId: string | null,
        readonly fromLat: number,
        readonly fromLong: number,
        readonly toLat: number,
        readonly toLong: number,
        readonly fare: number,
        readonly distance: number,
        readonly status: string,
        readonly date: Date,
    ) {
        if (fromLat < -90 || fromLat > 90) throw new Error("The latitude is invalid")
        if (toLat < -90 || toLat > 90) throw new Error("The latitude is invalid")
        if (fromLat < -180 || fromLat > 180) throw new Error("The longitude is invalid")
        if (toLat < -180 || toLat > 180) throw new Error("The longitude is invalid")
    }

    static create(
        passengerId: string,
        from: Coord,
        to: Coord,
    ) {
        const rideId = crypto.randomUUID();
        const status = "requested";
        const date = new Date();
        const fare = 0;
        const distance = 0;
        return new Ride(rideId, passengerId, null, from.lat, from.long, to.lat, to.long, fare, distance, status, date);
    }

    calculateDistance () {
        const earthRadius = 6371;
		const degreesToRadians = Math.PI / 180;
		const deltaLat = (this.toLat - this.fromLat) * degreesToRadians;
		const deltaLon = (this.toLong - this.fromLong) * degreesToRadians;
		const a =
			Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			Math.cos(this.fromLat * degreesToRadians) *
			Math.cos(this.toLat * degreesToRadians) *
			Math.sin(deltaLon / 2) *
			Math.sin(deltaLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = earthRadius * c;
		return Math.round(distance);
    }

    calculateFare () {
        const distance = this.calculateDistance();
        return distance * 2.1;
    }
}

type Coord = {
    lat: number,
    long: number,
}