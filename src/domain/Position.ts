import Coord from "./value-object/Coord";
import UUID from "./value-object/UUID";

export default class Position {
    private positionId: UUID;
    private rideId: UUID;
    private coord: Coord; 

    constructor(
        positionId: string,
        rideId: string,
        lat: number,
        long: number,
    ) {
        this.positionId = new UUID(positionId);
        this.rideId = new UUID(rideId);
        this.coord = new Coord(lat, long);
    }

    static create(
        rideId: string,
        lat: number,
        long: number,
    ) {
        const positionId = UUID.create().getValue();
        return new Position(positionId, rideId, lat, long);
    }

    getPositionId() {
        return this.positionId.getValue();
    }

    getRideId() {
        return this.rideId.getValue();
    }

    getCoord() {
        return this.coord;
    }

}