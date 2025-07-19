import Coord from "../value-object/Coord";
import UUID from "../value-object/UUID";
import RideStatus, { RideStatusFactory } from "../value-object/RideStatus";

// TDD: Entity, possui identidade e permite mutação
// TDD: Aggregate
export default class Ride {
    private rideId: UUID;
    private passengerId: UUID;
    private driverId?: UUID;
    private from: Coord;
    private to: Coord;
    private status: RideStatus;

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
        status: string,
        readonly date: Date,
    ) {
        this.rideId = new UUID(rideId);
        this.passengerId = new UUID(passengerId);
        if (driverId) this.driverId = new UUID(driverId);
        this.from = new Coord(fromLat, fromLong);
        this.to = new Coord(toLat, toLong);
        this.status = RideStatusFactory.create(status, this);
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
        this.status.accept();
        this.setDriverId(driverId);
    }

    start() {
        this.status.start();
    }

    finish() {
        this.status.finish();
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
        return this.status.value;
    }

    setStatus(status: RideStatus) {
        this.status = status;
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
