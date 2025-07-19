import Coord from "./value-object/Coord";
import UUID from "./value-object/UUID";

// TDD: Entity, possui identidade e permite mutação
// TDD: Aggregate
export default class Ride {
    private rideId: UUID;
    private passengerId: UUID;
    private driverId?: UUID;
    private from: Coord;
    private to: Coord;

    constructor(
        rideId: string,
        passengerId: string,
        driverId: string | null,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        private fare: number,
        private distance: number,
        private status: string,
        readonly date: Date,
    ) {
        this.rideId = new UUID(rideId);
        this.passengerId = new UUID(passengerId);
        if (driverId) this.driverId = new UUID(driverId);
        this.from = new Coord(fromLat, fromLong);
        this.to = new Coord(toLat, toLong);
    }

    static create (
        passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number
    ) {
        const rideId = UUID.create().getValue();
        const status = "requested";
        const date = new Date();
        const fare = 0;
        const distance = 0;
        return new Ride(rideId, passengerId, null, fromLat, fromLong, toLat, toLong, fare, distance, status, date);
    }

    accept(driverId: string) {
        if (this.status !== "requested") throw new Error("Invalid status");
        this.status = "accepted";
        this.setDriverId(driverId);
    }

    start() {
        if (this.status !== "accepted") throw new Error("Invalid status");
        this.status = "in_progress";
    }

    finish() {
        if (this.status !== "in_progress") throw new Error("Invalid status");
        this.status = "completed";
    }

    getRideId() {
        return this.rideId.getValue();
    }

    getPassengerId() {
        return this.passengerId.getValue();
    }

    getDriverId() {
        return this.driverId?.getValue();
    }

    getFrom() {
        return this.from;
    }

    getTo() {
        return this.to;
    }

    getStatus() {
        return this.status;
    }

    setDriverId(driverId: string) {
        this.driverId = new UUID(driverId);
    }

    getFare() {
        return this.fare;
    }

    setFare(fare: number) {
        this.fare = fare;
    }

    getDistance() {
        return this.distance;
    }

    setDistance(distance: number) {
        this.distance = distance;
    }
}
